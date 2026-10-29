import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { sha256 } from '../../../core/helpers/sha256.helper';
import { ComprovanteService } from '../../../core/services/comprovante/comprovante.service';

@Injectable()
export class VerificarAssinaturaComprovanteUseCase {
  constructor(private readonly comprovante: ComprovanteService) {}

  call(input: {
    orderId: number;
    file?: Express.Multer.File;
    receivedUserImage?: string | null;
    validacaoId?: string | null;
    assinaturaComprovante?: string | null;
  }): void {
    if (!this.comprovante.isEnabled()) return;

    const file = input.file;
    if (file?.buffer?.length) {
      this.assertAssinatura(input, file.buffer);
      return;
    }

    const legacy = input.receivedUserImage?.trim() || '';
    if (!legacy) return;

    throw new UnprocessableEntityException(
      'Foto do comprovante e assinatura da conferência são obrigatórias',
    );
  }

  private assertAssinatura(
    input: {
      orderId: number;
      validacaoId?: string | null;
      assinaturaComprovante?: string | null;
    },
    buffer: Buffer,
  ) {
    const validacaoId = input.validacaoId?.trim() || '';
    const assinatura = input.assinaturaComprovante?.trim() || '';
    const digest = sha256(buffer);
    const ok =
      !!validacaoId &&
      this.comprovante.isValidAssinatura(
        input.orderId,
        digest,
        validacaoId,
        assinatura,
      );
    if (ok) return;

    throw new UnprocessableEntityException(
      'Conferência do comprovante inválida para esta foto',
    );
  }
}
