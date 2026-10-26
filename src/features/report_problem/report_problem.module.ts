import { Module } from '@nestjs/common';
import { ReportProblemController } from './report_problem.controller';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { CreateDriverReportUseCase } from './use-cases/create_driver_report.use-case';
import { ResolveReportStatusUseCase } from './use-cases/resolve_report_status.use-case';
import { MarkOrderAfterReportUseCase } from './use-cases/mark_order_after_report.use-case';
import { CreateReportHistoricoUseCase } from './use-cases/create_report_historico.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { ChangeReportProblemStatusUseCase } from './use-cases/change_report_problem_status.use-case';
import { ReportProblemRepository } from './repositories/report_problem.repository';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [StatusModule],
  controllers: [ReportProblemController],
  providers: [
    FindOrderUseCase,
    CreateDriverReportUseCase,
    ResolveReportStatusUseCase,
    MarkOrderAfterReportUseCase,
    CreateReportHistoricoUseCase,
    FindCustomerUseCase,
    ChangeReportProblemStatusUseCase,
    ReportProblemRepository,
  ],
})
export class ReportProblemModule { }
