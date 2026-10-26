import { RescheduleOrderUseCase } from '../../../../src/features/create_order/use-cases/reschedule_order.use-case';
import type { CreateOrderRepository } from '../../../../src/features/create_order/repositories/create_order.repository';

describe('RescheduleOrderUseCase', () => {
  it('remarca data e hora do pedido encontrado', async () => {
    const calls: Array<{ orderId: string; date: string; time: string }> = [];
    const repository = {
      rescheduleOrder: async (orderId: string, date: string, time: string) => {
        calls.push({ orderId, date, time });
        return { count: 1 };
      },
    } as unknown as CreateOrderRepository;

    const response = await new RescheduleOrderUseCase(repository).call({
      order_id: '15',
      delivery_date: '2026-10-01',
      delivery_time: '14:00',
    });

    expect(calls).toEqual([
      { orderId: '15', date: '2026-10-01', time: '14:00' },
    ]);
    expect(response).toEqual({ success: true });
  });

  it('recusa quando nenhum pedido é atualizado', async () => {
    const repository = {
      rescheduleOrder: async () => ({ count: 0 }),
    } as unknown as CreateOrderRepository;

    await expect(
      new RescheduleOrderUseCase(repository).call({ order_id: '99' }),
    ).rejects.toThrow('Pedido não encontrado');
  });
});
