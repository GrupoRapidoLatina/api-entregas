import { CreateDriverReportUseCase } from '../../../../src/features/report_problem/use-cases/create_driver_report.use-case';
import type { ReportProblemRepository } from '../../../../src/features/report_problem/repositories/report_problem.repository';

describe('CreateDriverReportUseCase', () => {
  it('grava o relato do motorista', async () => {
    const calls: unknown[] = [];
    const repository = {
      createReport: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as ReportProblemRepository;
    const input = { idEntrega: 4, comment: 'portão fechado', message: 'AUSENTE' };

    await new CreateDriverReportUseCase(repository).call(input as never);
    expect(calls).toEqual([input]);
  });
});
