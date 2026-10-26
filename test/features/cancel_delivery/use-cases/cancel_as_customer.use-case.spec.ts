import { CancelAsCustomerUseCase } from '../../../../src/features/cancel_delivery/use-cases/cancel_as_customer.use-case';
import type { CancelDeliveryRepository } from '../../../../src/features/cancel_delivery/repositories/cancel_delivery.repository';

describe('CancelAsCustomerUseCase', () => {
  it('cancela o pedido do cliente', async () => {
    const calls: Array<{ orderId: string; userId: number }> = [];
    const repository = {
      cancelAsCustomer: async (orderId: string, userId: number) => {
        calls.push({ orderId, userId });
        return { count: 1 };
      },
    } as unknown as CancelDeliveryRepository;

    await new CancelAsCustomerUseCase(repository).call('4', 7);
    expect(calls).toEqual([{ orderId: '4', userId: 7 }]);
  });
});
