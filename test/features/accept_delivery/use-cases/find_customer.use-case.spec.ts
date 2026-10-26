import { FindCustomerUseCase } from '../../../../src/features/accept_delivery/use-cases/find_customer.use-case';
import type { AcceptDeliveryRepository } from '../../../../src/features/accept_delivery/repositories/accept_delivery.repository';

describe('FindCustomerUseCase do aceite', () => {
  it('devolve o cliente do pedido', async () => {
    const customer = { userId: 7, deviceToken: 'tok' };
    const repository = {
      findUser: async (userId: number) => (userId === 7 ? customer : null),
    } as unknown as AcceptDeliveryRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBe(
      customer,
    );
  });

  it('devolve nulo quando o cliente não existe', async () => {
    const repository = {
      findUser: async () => null,
    } as unknown as AcceptDeliveryRepository;

    await expect(new FindCustomerUseCase(repository).call(99)).resolves.toBeNull();
  });
});
