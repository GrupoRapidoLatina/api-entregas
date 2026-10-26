import { Injectable } from '@nestjs/common';
import { ReportProblemRepository } from '../repositories/report_problem.repository';
import type { MarkOrderAfterReportParams } from '../models/mark-order-after-report.params';

@Injectable()
export class MarkOrderAfterReportUseCase {
  constructor(private readonly repository: ReportProblemRepository) { }

  call(id: number, markOrderAfterReportParams: MarkOrderAfterReportParams) {
    return this.repository.updateOrderAfterReport(id, markOrderAfterReportParams);
  }
}
