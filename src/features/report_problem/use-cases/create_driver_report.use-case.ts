import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ReportProblemRepository } from '../repositories/report_problem.repository';

@Injectable()
export class CreateDriverReportUseCase {
  constructor(private readonly repository: ReportProblemRepository) {}

  call(data: Prisma.DriverReportCreateInput) {
    return this.repository.createReport(data);
  }
}
