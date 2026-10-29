import { Injectable } from '@nestjs/common';
import { ComprovanteService } from '../../../core/services/comprovante/comprovante.service';
import { ComprovanteVeredito } from '../../../core/shared/enums/comprovante-veredito.enum';

@Injectable()
export class AssinarComprovanteUseCase {
  constructor(private readonly comprovante: ComprovanteService) {}

  call(input: {
    orderId: number;
    sha256: string;
    validacaoId: string;
    veredito: ComprovanteVeredito;
  }): string {
    if (!this.podeAssinar(input.veredito)) return '';
    return this.comprovante.sign(
      input.orderId,
      input.sha256,
      input.validacaoId,
    );
  }

  private podeAssinar(veredito: ComprovanteVeredito): boolean {
    switch (veredito) {
      case ComprovanteVeredito.Aprovado:
      case ComprovanteVeredito.NaoConferida:
        return true;
      case ComprovanteVeredito.Reprovado:
        return false;
    }
  }
}
