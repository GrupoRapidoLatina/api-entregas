import { CancelAsDriverUseCase } from '../../../../src/features/cancel_delivery/use-cases/cancel_as_driver.use-case';
import type { CancelDeliveryRepository } from '../../../../src/features/cancel_delivery/repositories/cancel_delivery.repository';

describe('CancelAsDriverUseCase', () => {
  it('cancela o pedido atribuído ao motorista', async () => {
    const calls: Array<{ orderId: string; userId: number }> = [];
    const repository = {
      cancelAsDriver: async (orderId: string, userId: number) => {
        calls.push({ orderId, userId });
        return { count: 1 };
      },
    } as unknown as CancelDeliveryRepository;

    await new CancelAsDriverUseCase(repository).call('4', 8);
    expect(calls).toEqual([{ orderId: '4', userId: 8 }]);
  });
});
