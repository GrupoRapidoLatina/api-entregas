import { CreateCancelNotificationUseCase } from '../../../../src/features/cancel_delivery/use-cases/create_cancel_notification.use-case';
import type { CancelDeliveryRepository } from '../../../../src/features/cancel_delivery/repositories/cancel_delivery.repository';

describe('CreateCancelNotificationUseCase', () => {
  it('grava a notificação de cancelamento', async () => {
    const calls: unknown[] = [];
    const repository = {
      createNotification: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as CancelDeliveryRepository;
    const input = {
      orderId: 4,
      fromUserId: 7,
      toUserId: 8,
      message: 'Pedido cancelado com sucesso',
      type: 'cancel',
    };

    await new CreateCancelNotificationUseCase(repository).call(input);
    expect(calls).toEqual([input]);
  });
});
