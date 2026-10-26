import { FindCustomerUseCase } from '../../../../src/features/deliver_order/use-cases/find_customer.use-case';
import type { DeliverOrderRepository } from '../../../../src/features/deliver_order/repositories/deliver_order.repository';

describe('FindCustomerUseCase da entrega', () => {
  it('devolve o cliente para o push', async () => {
    const customer = { userId: 7, deviceToken: 'tok' };
    const repository = {
      findUser: async () => customer,
    } as unknown as DeliverOrderRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBe(
      customer,
    );
  });

  it('devolve nulo sem cliente', async () => {
    const repository = {
      findUser: async () => null,
    } as unknown as DeliverOrderRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBeNull();
  });
});
