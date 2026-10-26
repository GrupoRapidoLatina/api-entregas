import { Injectable } from '@nestjs/common';
import { NearbyDeliveriesRepository } from '../repositories/nearby_deliveries.repository';

@Injectable()
export class UpdateDriverLocationUseCase {
  constructor(private readonly repository: NearbyDeliveriesRepository) {}

  call(userId: number, latitude: string, longitude: string) {
    return this.repository.updateLocation(userId, latitude, longitude);
  }
}
