import { UpdateDriverLocationUseCase } from '../../../../src/features/nearby_deliveries/use-cases/update_driver_location.use-case';
import type { NearbyDeliveriesRepository } from '../../../../src/features/nearby_deliveries/repositories/nearby_deliveries.repository';

describe('UpdateDriverLocationUseCase', () => {
  it('grava latitude e longitude do motorista', async () => {
    const calls: Array<{ userId: number; latitude: string; longitude: string }> =
      [];
    const repository = {
      updateLocation: async (
        userId: number,
        latitude: string,
        longitude: string,
      ) => {
        calls.push({ userId, latitude, longitude });
      },
    } as unknown as NearbyDeliveriesRepository;

    await new UpdateDriverLocationUseCase(repository).call(8, '-23.5', '-46.6');
    expect(calls).toEqual([
      { userId: 8, latitude: '-23.5', longitude: '-46.6' },
    ]);
  });
});
