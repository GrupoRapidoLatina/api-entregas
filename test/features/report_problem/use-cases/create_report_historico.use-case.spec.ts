import { CreateReportHistoricoUseCase } from '../../../../src/features/report_problem/use-cases/create_report_historico.use-case';
import type { ReportProblemRepository } from '../../../../src/features/report_problem/repositories/report_problem.repository';

describe('CreateReportHistoricoUseCase', () => {
  it('grava o histórico do problema', async () => {
    const calls: unknown[] = [];
    const repository = {
      createHistorico: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as ReportProblemRepository;

    await new CreateReportHistoricoUseCase(repository).call({
      idEntrega: 4,
      ocorrencia: 'AUSENTE',
    } as never);
    expect(calls).toEqual([{ idEntrega: 4, ocorrencia: 'AUSENTE' }]);
  });
});
