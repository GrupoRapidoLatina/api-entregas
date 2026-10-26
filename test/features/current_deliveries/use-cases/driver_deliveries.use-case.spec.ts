import { DriverDeliveriesUseCase } from '../../../../src/features/current_deliveries/use-cases/driver_deliveries.use-case';
import type { CurrentDeliveriesRepository } from '../../../../src/features/current_deliveries/repositories/current_deliveries.repository';

describe('DriverDeliveriesUseCase', () => {
  it('devolve as entregas atuais do motorista', async () => {
    const repository = {
      findDriverDeliveries: async () => [
        { id: 8, orderId: '8', userId: 7, driverId: 9, deliveryCost: '18.00' },
      ],
    } as unknown as CurrentDeliveriesRepository;

    const response = await new DriverDeliveriesUseCase(repository).call(9);

    expect(response.data).toEqual([
      expect.objectContaining({ id: 8, order_id: '8', driver_id: 9 }),
    ]);
  });

  it('devolve lista vazia sem entregas do motorista', async () => {
    const repository = {
      findDriverDeliveries: async () => [],
    } as unknown as CurrentDeliveriesRepository;

    await expect(new DriverDeliveriesUseCase(repository).call(9)).resolves.toEqual(
      { success: true, data: [] },
    );
  });
});
