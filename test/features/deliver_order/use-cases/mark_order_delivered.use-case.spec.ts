import { MarkOrderDeliveredUseCase } from '../../../../src/features/deliver_order/use-cases/mark_order_delivered.use-case';
import type { DeliverOrderRepository } from '../../../../src/features/deliver_order/repositories/deliver_order.repository';
import { DeliveryStatus } from '../../../../src/core/shared/enums/delivery-status.enum';

describe('MarkOrderDeliveredUseCase', () => {
  it('grava assinatura, foto e status de entregue', async () => {
    const calls: unknown[] = [];
    const repository = {
      updateDelivered: async (id: number, data: unknown) => {
        calls.push({ id, data });
      },
    } as unknown as DeliverOrderRepository;
    const data = {
      signatureName: 'Ana',
      latitudeFoto: '-23.5',
      longitudeFoto: '-46.6',
      updateLat: '-23.5',
      updateLon: '-46.6',
      deliveryStatus: DeliveryStatus.Delivered,
      dataEntregue: '2026-09-30',
    };

    await new MarkOrderDeliveredUseCase(repository).call(4, data);
    expect(calls).toEqual([{ id: 4, data }]);
  });
});
