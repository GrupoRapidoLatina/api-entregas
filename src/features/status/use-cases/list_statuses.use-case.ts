import { Injectable, NotFoundException } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { StatusRepository } from '../repositories/status.repository';

@Injectable()
export class ListStatusesUseCase {
  constructor(private readonly repository: StatusRepository) {}

  async call(tipo?: string) {
    const rows =
      tipo === 'problema'
        ? await this.repository.findActiveProblems()
        : await this.repository.findActive();

    if (!rows.length) {
      throw new NotFoundException('Nenhum status disponível');
    }

    return ok(
      rows.map((row) => ({
        codigo: row.codigo,
        macro_status: row.macroStatus,
        micro_status: row.microStatus,
        ativo: row.ativo,
        finalizador: row.finalizador,
      })),
    );
  }
}
