import { CreateDeliveryNotificationUseCase } from '../../../../src/features/deliver_order/use-cases/create_delivery_notification.use-case';
import type { DeliverOrderRepository } from '../../../../src/features/deliver_order/repositories/deliver_order.repository';

describe('CreateDeliveryNotificationUseCase', () => {
  it('grava a notificação de entrega', async () => {
    const calls: unknown[] = [];
    const repository = {
      createNotification: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as DeliverOrderRepository;
    const input = {
      orderId: 4,
      fromUserId: 8,
      toUserId: 7,
      message: 'O pedido foi entregue',
      type: 'deliver',
    };

    await new CreateDeliveryNotificationUseCase(repository).call(input);
    expect(calls).toEqual([input]);
  });
});
