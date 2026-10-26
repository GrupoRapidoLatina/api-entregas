import { GetUserVehicleTypeUseCase } from '../../../../src/features/nearby_deliveries/use-cases/get_user_vehicle_type.use-case';
import type { NearbyDeliveriesRepository } from '../../../../src/features/nearby_deliveries/repositories/nearby_deliveries.repository';

describe('GetUserVehicleTypeUseCase', () => {
  it('devolve o veículo cadastrado', async () => {
    const repository = {
      findUser: async () => ({ vehicleType: 'motorbike' }),
    } as unknown as NearbyDeliveriesRepository;

    await expect(new GetUserVehicleTypeUseCase(repository).call(8)).resolves.toBe(
      'motorbike',
    );
  });

  it('devolve vazio quando o usuário ou o veículo não existem', async () => {
    const missing = {
      findUser: async () => null,
    } as unknown as NearbyDeliveriesRepository;
    const blank = {
      findUser: async () => ({ vehicleType: null }),
    } as unknown as NearbyDeliveriesRepository;

    await expect(new GetUserVehicleTypeUseCase(missing).call(8)).resolves.toBe(
      '',
    );
    await expect(new GetUserVehicleTypeUseCase(blank).call(8)).resolves.toBe('');
  });
});
