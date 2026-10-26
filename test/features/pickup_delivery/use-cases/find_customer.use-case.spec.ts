import { FindCustomerUseCase } from '../../../../src/features/pickup_delivery/use-cases/find_customer.use-case';
import type { PickupDeliveryRepository } from '../../../../src/features/pickup_delivery/repositories/pickup_delivery.repository';

describe('FindCustomerUseCase da coleta', () => {
  it('devolve o cliente da coleta', async () => {
    const customer = { deviceToken: 'tok' };
    const repository = {
      findUser: async () => customer,
    } as unknown as PickupDeliveryRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBe(
      customer,
    );
  });

  it('devolve nulo sem cliente', async () => {
    const repository = {
      findUser: async () => null,
    } as unknown as PickupDeliveryRepository;

    await expect(new FindCustomerUseCase(repository).call(7)).resolves.toBeNull();
  });
});
