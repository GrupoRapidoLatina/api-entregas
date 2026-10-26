import { FindOrderUseCase } from '../../../../src/features/report_problem/use-cases/find_order.use-case';
import type { ReportProblemRepository } from '../../../../src/features/report_problem/repositories/report_problem.repository';

describe('FindOrderUseCase do problema', () => {
  it('devolve o pedido informado', async () => {
    const order = { id: 4, idOperacao: 3 };
    const repository = {
      findOrderById: async () => order,
    } as unknown as ReportProblemRepository;

    await expect(new FindOrderUseCase(repository).call(4)).resolves.toBe(order);
  });

  it('recusa pedido inexistente', async () => {
    const repository = {
      findOrderById: async () => null,
    } as unknown as ReportProblemRepository;

    await expect(new FindOrderUseCase(repository).call(9)).rejects.toThrow(
      'Pedido não encontrado',
    );
  });
});
