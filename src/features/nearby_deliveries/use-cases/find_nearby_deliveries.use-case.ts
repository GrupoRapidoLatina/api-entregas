import { Injectable } from '@nestjs/common';
import { NearbyDeliveriesRepository } from '../repositories/nearby_deliveries.repository';

@Injectable()
export class FindNearbyDeliveriesUseCase {
  constructor(private readonly repository: NearbyDeliveriesRepository) {}

  call(latitude: string, longitude: string, vehicleType: string) {
    return this.repository.findNearbyDeliveries(latitude, longitude, vehicleType);
  }
}
