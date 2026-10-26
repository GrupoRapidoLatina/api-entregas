import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { NearbyDeliveryBoysDto } from '../dto/nearby_delivery_boys.dto';
import { NearbyDeliveriesRepository } from '../repositories/nearby_deliveries.repository';

@Injectable()
export class NearbyDeliveryBoysUseCase {
  constructor(private readonly repository: NearbyDeliveriesRepository) { }

  async call(dto: NearbyDeliveryBoysDto) {
    const latitude = dto.latitude ?? '';
    const longitude = dto.longitude ?? '';
    const rows = await this.repository.findNearbyDeliveryBoys(latitude, longitude);
    return ok(rows);
  }
}
