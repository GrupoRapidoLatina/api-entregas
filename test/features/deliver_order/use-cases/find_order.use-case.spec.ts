import { FindOrderUseCase } from '../../../../src/features/deliver_order/use-cases/find_order.use-case';
import type { DeliverOrderRepository } from '../../../../src/features/deliver_order/repositories/deliver_order.repository';

describe('FindOrderUseCase da entrega', () => {
  it('devolve o pedido pelo id', async () => {
    const order = { id: 4, idOperacao: 3 };
    const repository = {
      findById: async (id: number) => (id === 4 ? order : null),
    } as unknown as DeliverOrderRepository;

    await expect(new FindOrderUseCase(repository).call(4)).resolves.toBe(order);
  });

  it('devolve nulo quando o pedido não existe', async () => {
    const repository = {
      findById: async () => null,
    } as unknown as DeliverOrderRepository;

    await expect(new FindOrderUseCase(repository).call(9)).resolves.toBeNull();
  });
});
