import { Module } from '@nestjs/common';
import { NearbyDeliveriesController } from './nearby_deliveries.controller';
import { UpdateDriverLocationUseCase } from './use-cases/update_driver_location.use-case';
import { GetUserVehicleTypeUseCase } from './use-cases/get_user_vehicle_type.use-case';
import { FindNearbyDeliveriesUseCase } from './use-cases/find_nearby_deliveries.use-case';
import { NearbyDeliveryBoysUseCase } from './use-cases/nearby_delivery_boys.use-case';
import { NearbyDeliveriesRepository } from './repositories/nearby_deliveries.repository';

@Module({
  controllers: [NearbyDeliveriesController],
  providers: [
    UpdateDriverLocationUseCase,
    GetUserVehicleTypeUseCase,
    FindNearbyDeliveriesUseCase,
    NearbyDeliveryBoysUseCase,
    NearbyDeliveriesRepository,
  ],
})
export class NearbyDeliveriesModule {}
