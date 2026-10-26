import { UserDeliveriesUseCase } from '../../../../src/features/current_deliveries/use-cases/user_deliveries.use-case';
import type { CurrentDeliveriesRepository } from '../../../../src/features/current_deliveries/repositories/current_deliveries.repository';

describe('UserDeliveriesUseCase', () => {
  it('devolve as entregas atuais do cliente no contrato da API', async () => {
    const repository = {
      findUserDeliveries: async (userId: number) =>
        userId === 7
          ? [
              {
                id: 4,
                orderId: '4',
                userId: 7,
                driverId: 0,
                pickupaddress: 'Rua A',
                dropoffaddress: 'Rua B',
                deliveryCost: '20.00',
                deliveryStatus: 5,
                deliveryDate: new Date('2026-09-30T15:00:00.000Z'),
                createdAt: new Date('2026-09-30T12:00:00.000Z'),
              },
            ]
          : [],
    } as unknown as CurrentDeliveriesRepository;

    const response = await new UserDeliveriesUseCase(repository).call(7);

    expect(response.success).toBe(true);
    expect(response.data).toEqual([
      expect.objectContaining({
        id: 4,
        order_id: '4',
        delivery_cost: '20.00',
        delivery_date: '2026-09-30',
      }),
    ]);
  });

  it('devolve lista vazia quando o cliente não tem entrega atual', async () => {
    const repository = {
      findUserDeliveries: async () => [],
    } as unknown as CurrentDeliveriesRepository;

    await expect(new UserDeliveriesUseCase(repository).call(7)).resolves.toEqual({
      success: true,
      data: [],
    });
  });
});
