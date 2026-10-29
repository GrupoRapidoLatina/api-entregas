import { createHmac, timingSafeEqual } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import {
  COMPROVANTE_POLL_INTERVAL_MS,
  COMPROVANTE_RATE_LIMIT_MAX_REQUESTS,
  COMPROVANTE_RATE_LIMIT_WINDOW_MS,
  COMPROVANTE_TIMEOUT_MS,
} from '../../config/comprovante.config';
import { sha256 } from '../../helpers/sha256.helper';
import { ComprovanteValidadorStatus } from '../../shared/enums/comprovante-validador-status.enum';
import { ComprovanteVeredito } from '../../shared/enums/comprovante-veredito.enum';
import type { ResultadoComprovante } from './models/resultado-comprovante.model';
import type { ValidadorPayload } from './models/validador-payload.model';

@Injectable()
export class ComprovanteService {
  private readonly logger = new Logger(ComprovanteService.name);
  private readonly rateLimitTimestampsByOrigin = new Map<string, number[]>();

  isEnabled(): boolean {
    return process.env.COMPROVANTE_VALIDACAO_ENABLED !== 'false';
  }

  tryConsumeRateLimit(originKey: string): boolean {
    const origin = originKey.trim() || 'app';
    const nowMs = Date.now();
    const timestampsInWindow = (
      this.rateLimitTimestampsByOrigin.get(origin) ?? []
    ).filter(
      (timestampMs) => nowMs - timestampMs < COMPROVANTE_RATE_LIMIT_WINDOW_MS,
    );

    if (timestampsInWindow.length >= COMPROVANTE_RATE_LIMIT_MAX_REQUESTS) {
      this.rateLimitTimestampsByOrigin.set(origin, timestampsInWindow);
      return false;
    }

    timestampsInWindow.push(nowMs);
    this.rateLimitTimestampsByOrigin.set(origin, timestampsInWindow);
    return true;
  }

  sign(orderId: number, imageSha256: string, validacaoId: string): string {
    const signPayload = `comprovante:${orderId}:${imageSha256}:${validacaoId}`;
    return createHmac('sha256', this.hmacSecret())
      .update(signPayload)
      .digest('hex');
  }

  isValidAssinatura(
    orderId: number,
    imageSha256: string,
    validacaoId: string,
    assinatura?: string | null,
  ): boolean {
    const assinaturaRecebida = String(assinatura ?? '').trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(assinaturaRecebida)) return false;

    const assinaturaEsperada = this.sign(orderId, imageSha256, validacaoId);
    return timingSafeEqual(
      Buffer.from(assinaturaEsperada, 'utf8'),
      Buffer.from(assinaturaRecebida, 'utf8'),
    );
  }

  async conferir(input: {
    buffer: Buffer;
    orderId: number;
    nfNumero?: string | null;
    contentType?: string;
    fileName?: string;
  }): Promise<ResultadoComprovante> {
    const startedAtMs = Date.now();
    const resultadoNaoConferido = (): ResultadoComprovante => ({
      validacaoId: 'nao_conferida',
      veredito: ComprovanteVeredito.NaoConferida,
      motivos: [],
      tempoMs: Date.now() - startedAtMs,
    });

    if (!this.isEnabled()) return resultadoNaoConferido();

    const apiKey = process.env.COMPROVANTE_API_KEY?.trim();
    const baseUrl = process.env.COMPROVANTE_BASE_URL?.trim()?.replace(
      /\/$/,
      '',
    );
    if (!apiKey || !baseUrl) return resultadoNaoConferido();

    const imageSha256 = sha256(input.buffer);
    const idempotencyKey = `${input.orderId}-${imageSha256}`;

    try {
      const validacaoCriada = await this.criarValidacao({
        baseUrl,
        apiKey,
        idempotencyKey,
        buffer: input.buffer,
        orderId: input.orderId,
        nfNumero: input.nfNumero,
        contentType: input.contentType,
        fileName: input.fileName,
      });
      if (!validacaoCriada?.validacao_id) return resultadoNaoConferido();

      if (validacaoCriada.status === ComprovanteValidadorStatus.Concluida) {
        return this.toResultado(validacaoCriada, startedAtMs);
      }

      const deadlineAtMs = startedAtMs + COMPROVANTE_TIMEOUT_MS;
      while (Date.now() < deadlineAtMs) {
        await new Promise((resolve) =>
          setTimeout(resolve, COMPROVANTE_POLL_INTERVAL_MS),
        );
        const validacaoAtual = await this.consultarValidacao({
          baseUrl,
          apiKey,
          validacaoId: validacaoCriada.validacao_id,
        });
        if (!validacaoAtual) return resultadoNaoConferido();
        if (
          validacaoAtual.status === ComprovanteValidadorStatus.Concluida ||
          validacaoAtual.status === ComprovanteValidadorStatus.Erro
        ) {
          return this.toResultado(validacaoAtual, startedAtMs);
        }
      }
      return resultadoNaoConferido();
    } catch (err) {
      this.logger.warn(`Validador indisponível: ${String(err)}`);
      return resultadoNaoConferido();
    }
  }

  private async criarValidacao(input: {
    baseUrl: string;
    apiKey: string;
    idempotencyKey: string;
    buffer: Buffer;
    orderId: number;
    nfNumero?: string | null;
    contentType?: string;
    fileName?: string;
  }) {
    const formData = new FormData();
    const imageBlob = new Blob([new Uint8Array(input.buffer)], {
      type: input.contentType || 'image/jpeg',
    });
    formData.append('imagem', imageBlob, input.fileName || 'comprovante.jpg');
    formData.append('entrega_id', String(input.orderId));

    const nfEsperada = String(input.nfNumero ?? '').trim();
    if (nfEsperada) formData.append('nf_esperada', nfEsperada);

    const response = await fetch(`${input.baseUrl}/v1/validacoes`, {
      method: 'POST',
      headers: {
        'x-api-key': input.apiKey,
        'Idempotency-Key': input.idempotencyKey,
        'X-Origem': 'app',
      },
      body: formData,
      signal: AbortSignal.timeout(COMPROVANTE_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as ValidadorPayload;
  }

  private async consultarValidacao(input: {
    baseUrl: string;
    apiKey: string;
    validacaoId: string;
  }) {
    const response = await fetch(
      `${input.baseUrl}/v1/validacoes/${encodeURIComponent(input.validacaoId)}`,
      {
        method: 'GET',
        headers: { 'x-api-key': input.apiKey },
        signal: AbortSignal.timeout(COMPROVANTE_TIMEOUT_MS),
      },
    );
    if (!response.ok) return null;
    return (await response.json()) as ValidadorPayload;
  }

  private toResultado(
    payload: ValidadorPayload,
    startedAtMs: number,
  ): ResultadoComprovante {
    if (payload.status !== ComprovanteValidadorStatus.Concluida) {
      return {
        validacaoId: 'nao_conferida',
        veredito: ComprovanteVeredito.NaoConferida,
        motivos: [],
        tempoMs: Date.now() - startedAtMs,
      };
    }

    const veredito = this.parseVeredito(payload.veredito);
    return {
      validacaoId:
        veredito === ComprovanteVeredito.NaoConferida
          ? 'nao_conferida'
          : payload.validacao_id,
      veredito,
      motivos: Array.isArray(payload.motivos) ? payload.motivos : [],
      tempoMs: Date.now() - startedAtMs,
    };
  }

  private parseVeredito(vereditoRaw?: string | null): ComprovanteVeredito {
    switch (vereditoRaw) {
      case ComprovanteVeredito.Aprovado:
        return ComprovanteVeredito.Aprovado;
      case ComprovanteVeredito.Reprovado:
        return ComprovanteVeredito.Reprovado;
      default:
        return ComprovanteVeredito.NaoConferida;
    }
  }

  private hmacSecret(): string {
    return (
      process.env.COMPROVANTE_HMAC_SECRET?.trim() ||
      process.env.JWT_SECRET?.trim() ||
      'change-me-in-production'
    );
  }
}
