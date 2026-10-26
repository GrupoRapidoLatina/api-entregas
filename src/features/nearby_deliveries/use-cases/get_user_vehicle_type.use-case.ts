import { Injectable } from '@nestjs/common';
import { NearbyDeliveriesRepository } from '../repositories/nearby_deliveries.repository';

@Injectable()
export class GetUserVehicleTypeUseCase {
  constructor(private readonly repository: NearbyDeliveriesRepository) {}

  async call(userId: number) {
    const me = await this.repository.findUser(userId);
    return me?.vehicleType || '';
  }
}
