import { MarkPickupUseCase } from '../../../../src/features/pickup_delivery/use-cases/mark_pickup.use-case';
import type { PickupDeliveryRepository } from '../../../../src/features/pickup_delivery/repositories/pickup_delivery.repository';

describe('MarkPickupUseCase', () => {
  it('marca a coleta para o motorista', async () => {
    const calls: Array<{ id: number; userId: number }> = [];
    const repository = {
      updatePickup: async (id: number, userId: number) => {
        calls.push({ id, userId });
      },
    } as unknown as PickupDeliveryRepository;

    await new MarkPickupUseCase(repository).call(4, 8);
    expect(calls).toEqual([{ id: 4, userId: 8 }]);
  });
});
