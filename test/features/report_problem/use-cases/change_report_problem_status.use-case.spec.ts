import { ChangeReportProblemStatusUseCase } from '../../../../src/features/report_problem/use-cases/change_report_problem_status.use-case';
import type { ReportProblemRepository } from '../../../../src/features/report_problem/repositories/report_problem.repository';

describe('ChangeReportProblemStatusUseCase', () => {
  it('devolve o pedido ao status disponível para o cliente', async () => {
    const calls: Array<{ userId: number; orderId: string }> = [];
    const repository = {
      resetOrderToReportStatus: async (userId: number, orderId: string) => {
        calls.push({ userId, orderId });
      },
    } as unknown as ReportProblemRepository;

    await expect(
      new ChangeReportProblemStatusUseCase(repository).call(7, {
        order_id: '4',
      }),
    ).resolves.toEqual({ success: true });
    expect(calls).toEqual([{ userId: 7, orderId: '4' }]);
  });
});
