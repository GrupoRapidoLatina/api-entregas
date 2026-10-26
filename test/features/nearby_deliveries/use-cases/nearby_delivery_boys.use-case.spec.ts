import { NearbyDeliveryBoysUseCase } from '../../../../src/features/nearby_deliveries/use-cases/nearby_delivery_boys.use-case';
import type { NearbyDeliveriesRepository } from '../../../../src/features/nearby_deliveries/repositories/nearby_deliveries.repository';

describe('NearbyDeliveryBoysUseCase', () => {
  it('devolve os motoristas próximos', async () => {
    const repository = {
      findNearbyDeliveryBoys: async () => [{ user_id: 8, distance: 0.4 }],
    } as unknown as NearbyDeliveriesRepository;

    await expect(
      new NearbyDeliveryBoysUseCase(repository).call({
        latitude: '-23.5',
        longitude: '-46.6',
      }),
    ).resolves.toEqual({
      success: true,
      data: [{ user_id: 8, distance: 0.4 }],
    });
  });

  it('devolve lista vazia sem motoristas na área', async () => {
    const repository = {
      findNearbyDeliveryBoys: async () => [],
    } as unknown as NearbyDeliveriesRepository;

    await expect(
      new NearbyDeliveryBoysUseCase(repository).call({
        latitude: '0',
        longitude: '0',
      }),
    ).resolves.toEqual({ success: true, data: [] });
  });
});
