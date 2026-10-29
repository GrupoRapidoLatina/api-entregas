import { Injectable, Logger } from '@nestjs/common';
import { sha256 } from '../../../core/helpers/sha256.helper';
import { ComprovanteService } from '../../../core/services/comprovante/comprovante.service';
import type { ResultadoComprovante } from '../../../core/services/comprovante/models/resultado-comprovante.model';

@Injectable()
export class ValidarComprovanteUseCase {
  private readonly logger = new Logger(ValidarComprovanteUseCase.name);

  constructor(private readonly comprovante: ComprovanteService) {}

  async call(input: {
    orderId: number;
    nfNumero?: string | null;
    file: Express.Multer.File;
  }): Promise<ResultadoComprovante & { sha256: string }> {
    const resultado = await this.comprovante.conferir({
      buffer: input.file.buffer,
      orderId: input.orderId,
      nfNumero: input.nfNumero,
      contentType: input.file.mimetype,
      fileName: input.file.originalname,
    });

    this.logger.log(
      JSON.stringify({
        event: 'comprovante_validacao',
        order_id: input.orderId,
        validacao_id: resultado.validacaoId,
        veredito: resultado.veredito,
        motivos: resultado.motivos,
        tempo_ms: resultado.tempoMs,
      }),
    );

    return {
      ...resultado,
      sha256: sha256(input.file.buffer),
    };
  }
}
