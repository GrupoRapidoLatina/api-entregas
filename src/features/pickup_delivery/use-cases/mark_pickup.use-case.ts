import { Injectable } from '@nestjs/common';
import { PickupDeliveryRepository } from '../repositories/pickup_delivery.repository';

@Injectable()
export class MarkPickupUseCase {
  constructor(private readonly repository: PickupDeliveryRepository) {}

  call(id: number, userId: number) {
    return this.repository.updatePickup(id, userId);
  }
}
