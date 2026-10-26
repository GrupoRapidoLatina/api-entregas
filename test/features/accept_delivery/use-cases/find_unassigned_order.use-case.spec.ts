import { FindUnassignedOrderUseCase } from '../../../../src/features/accept_delivery/use-cases/find_unassigned_order.use-case';
import type { AcceptDeliveryRepository } from '../../../../src/features/accept_delivery/repositories/accept_delivery.repository';

describe('FindUnassignedOrderUseCase', () => {
  it('devolve o pedido ainda sem motorista', async () => {
    const order = { id: 4, orderId: '4', driverId: 0 };
    const repository = {
      findUnassignedByOrderId: async (orderId: string) =>
        orderId === '4' ? order : null,
    } as unknown as AcceptDeliveryRepository;

    await expect(new FindUnassignedOrderUseCase(repository).call('4')).resolves.toBe(
      order,
    );
  });

  it('recusa pedido inexistente ou já atribuído', async () => {
    const repository = {
      findUnassignedByOrderId: async () => null,
    } as unknown as AcceptDeliveryRepository;

    await expect(
      new FindUnassignedOrderUseCase(repository).call('9'),
    ).rejects.toThrow('Não aceito !');
  });
});
