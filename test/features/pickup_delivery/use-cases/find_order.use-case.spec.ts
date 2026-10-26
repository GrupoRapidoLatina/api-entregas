import { FindOrderUseCase } from '../../../../src/features/pickup_delivery/use-cases/find_order.use-case';
import type { PickupDeliveryRepository } from '../../../../src/features/pickup_delivery/repositories/pickup_delivery.repository';

describe('FindOrderUseCase da coleta', () => {
  it('devolve o primeiro pedido encontrado', async () => {
    const order = { id: 4, idOperacao: 3 };
    const repository = {
      findById: async () => [order],
    } as unknown as PickupDeliveryRepository;

    await expect(new FindOrderUseCase(repository).call(4)).resolves.toBe(order);
  });

  it('recusa quando o pedido não existe', async () => {
    const repository = {
      findById: async () => [],
    } as unknown as PickupDeliveryRepository;

    await expect(new FindOrderUseCase(repository).call(9)).rejects.toThrow(
      'Pedido não encontrado',
    );
  });
});
