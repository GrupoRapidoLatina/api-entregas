import { FindCustomerUseCase } from '../../../../src/features/report_problem/use-cases/find_customer.use-case';
import type { ReportProblemRepository } from '../../../../src/features/report_problem/repositories/report_problem.repository';

describe('FindCustomerUseCase do problema', () => {
  it('devolve o cliente do pedido', async () => {
    const customer = { deviceToken: 'tok' };
    const repository = {
      findUser: async () => customer,
    } as unknown as ReportProblemRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBe(
      customer,
    );
  });

  it('devolve nulo sem cliente', async () => {
    const repository = {
      findUser: async () => null,
    } as unknown as ReportProblemRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBeNull();
  });
});
