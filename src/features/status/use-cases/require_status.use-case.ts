import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusRepository } from '../repositories/status.repository';
import type { RequiredStatus } from '../models/required-status.model';

@Injectable()
export class RequireStatusUseCase {
  constructor(private readonly repository: StatusRepository) { }

  async call(microStatus: string): Promise<RequiredStatus> {
    const wanted = microStatus.trim();
    if (!wanted) {
      throw new BadRequestException('micro_status é obrigatório');
    }

    const status = await this.repository.findByMicroStatus(wanted);
    if (!status?.codigo || !status.microStatus) {
      throw new BadRequestException(
        `Status "${wanted}" não existe na tabela status`,
      );
    }

    return {
      ...status,
      codigo: status.codigo,
      microStatus: status.microStatus,
    };
  }
}
