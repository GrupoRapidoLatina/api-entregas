import { FindNearbyDeliveriesUseCase } from '../../../../src/features/nearby_deliveries/use-cases/find_nearby_deliveries.use-case';
import type { NearbyDeliveriesRepository } from '../../../../src/features/nearby_deliveries/repositories/nearby_deliveries.repository';

describe('FindNearbyDeliveriesUseCase', () => {
  it('busca entregas pela posição e pelo veículo', async () => {
    const calls: unknown[] = [];
    const rows = [{ id: 4, distance: 1.2 }];
    const repository = {
      findNearbyDeliveries: async (
        latitude: string,
        longitude: string,
        vehicleType: string,
      ) => {
        calls.push({ latitude, longitude, vehicleType });
        return rows;
      },
    } as unknown as NearbyDeliveriesRepository;

    await expect(
      new FindNearbyDeliveriesUseCase(repository).call(
        '-23.5',
        '-46.6',
        'motorbike',
      ),
    ).resolves.toBe(rows);
    expect(calls).toEqual([
      { latitude: '-23.5', longitude: '-46.6', vehicleType: 'motorbike' },
    ]);
  });
});
