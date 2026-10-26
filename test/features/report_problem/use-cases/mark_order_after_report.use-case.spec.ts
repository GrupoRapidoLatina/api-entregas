import { MarkOrderAfterReportUseCase } from '../../../../src/features/report_problem/use-cases/mark_order_after_report.use-case';
import type { ReportProblemRepository } from '../../../../src/features/report_problem/repositories/report_problem.repository';
import { DeliveryStatus } from '../../../../src/core/shared/enums/delivery-status.enum';

describe('MarkOrderAfterReportUseCase', () => {
  it('atualiza o pedido depois do relato', async () => {
    const calls: unknown[] = [];
    const repository = {
      updateOrderAfterReport: async (id: number, data: unknown) => {
        calls.push({ id, data });
      },
    } as unknown as ReportProblemRepository;
    const data = {
      deliveryStatus: DeliveryStatus.Legacy6,
      insucessoLat: '-23.5',
      insucessoLon: '-46.6',
      updateLat: '-23.5',
      updateLon: '-46.6',
    };

    await new MarkOrderAfterReportUseCase(repository).call(4, data);
    expect(calls).toEqual([{ id: 4, data }]);
  });
});
