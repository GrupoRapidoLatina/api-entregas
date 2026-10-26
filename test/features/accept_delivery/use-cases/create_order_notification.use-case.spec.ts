import { CreateOrderNotificationUseCase } from '../../../../src/features/accept_delivery/use-cases/create_order_notification.use-case';
import type { AcceptDeliveryRepository } from '../../../../src/features/accept_delivery/repositories/accept_delivery.repository';

describe('CreateOrderNotificationUseCase', () => {
  it('grava a notificação de aceite', async () => {
    const calls: unknown[] = [];
    const repository = {
      createNotification: async (data: unknown) => {
        calls.push(data);
        return { id: 1 };
      },
    } as unknown as AcceptDeliveryRepository;
    const input = {
      orderId: 4,
      fromUserId: 8,
      toUserId: 7,
      message: 'O motorista foi atribuído ao seu pedido',
      type: 'accept',
    };

    await new CreateOrderNotificationUseCase(repository).call(input);

    expect(calls).toEqual([input]);
  });
});
