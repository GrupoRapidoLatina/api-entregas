import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReportProblemRepository } from '../repositories/report_problem.repository';

@Injectable()
export class CreateReportHistoricoUseCase {
  constructor(private readonly repository: ReportProblemRepository) { }

  call(data: Prisma.OrderHistoricoCreateInput) {
    return this.repository.createHistorico(data);
  }
}
