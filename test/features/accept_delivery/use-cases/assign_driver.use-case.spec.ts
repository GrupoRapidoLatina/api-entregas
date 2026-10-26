import { AssignDriverUseCase } from '../../../../src/features/accept_delivery/use-cases/assign_driver.use-case';
import type { AcceptDeliveryRepository } from '../../../../src/features/accept_delivery/repositories/accept_delivery.repository';

describe('AssignDriverUseCase', () => {
  it('encaminha pedido e motorista para o repositório', async () => {
    const calls: Array<{ orderId: string; userId: number }> = [];
    const repository = {
      assignDriver: async (orderId: string, userId: number) => {
        calls.push({ orderId, userId });
        return { count: 1 };
      },
    } as unknown as AcceptDeliveryRepository;

    await expect(
      new AssignDriverUseCase(repository).call('4', 8),
    ).resolves.toEqual({ count: 1 });
    expect(calls).toEqual([{ orderId: '4', userId: 8 }]);
  });
});
