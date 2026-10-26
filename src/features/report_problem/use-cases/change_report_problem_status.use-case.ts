import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { ChangeReportProblemStatusDto } from '../dto/change_report_problem_status.dto';
import { ReportProblemRepository } from '../repositories/report_problem.repository';

@Injectable()
export class ChangeReportProblemStatusUseCase {
  constructor(private readonly repository: ReportProblemRepository) {}

  async call(userId: number, dto: ChangeReportProblemStatusDto) {
    const orderId = dto.order_id ?? '';
    await this.repository.resetOrderToReportStatus(userId, orderId);
    return ok();
  }
}
