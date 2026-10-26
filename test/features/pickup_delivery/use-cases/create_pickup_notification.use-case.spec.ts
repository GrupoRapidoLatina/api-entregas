import { CreatePickupNotificationUseCase } from '../../../../src/features/pickup_delivery/use-cases/create_pickup_notification.use-case';
import type { PickupDeliveryRepository } from '../../../../src/features/pickup_delivery/repositories/pickup_delivery.repository';

describe('CreatePickupNotificationUseCase', () => {
  it('grava a notificação de coleta', async () => {
    const calls: unknown[] = [];
    const repository = {
      createNotification: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as PickupDeliveryRepository;
    const input = {
      orderId: 4,
      fromUserId: 8,
      toUserId: 7,
      message: 'O motorista coletou o pedido',
      type: 'pickup',
    };

    await new CreatePickupNotificationUseCase(repository).call(input);
    expect(calls).toEqual([input]);
  });
});
