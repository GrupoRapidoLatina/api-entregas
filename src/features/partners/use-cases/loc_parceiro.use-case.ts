import { Injectable, NotFoundException } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { LocParceiroDto } from '../dto/loc_parceiro.dto';
import { PartnersRepository } from '../repositories/partners.repository';

@Injectable()
export class LocParceiroUseCase {
  constructor(private readonly repository: PartnersRepository) { }

  async call(dto: LocParceiroDto) {
    const cnpj = (dto.cnpj ?? '').replace(/\D/g, '');
    const selectdata = await this.repository.findActiveByCnpj(cnpj);
    if (!selectdata.length) {
      throw new NotFoundException('Parceiro não encontrado');
    }
    const last = selectdata[selectdata.length - 1];
    return ok([
      {
        codigo: last.codigo,
        razao: last.razao,
        cgc: last.cgc,
      },
    ]);
  }
}
