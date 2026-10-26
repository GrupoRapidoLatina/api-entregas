import { Injectable } from '@nestjs/common';
import { PickupDeliveryRepository } from '../repositories/pickup_delivery.repository';

@Injectable()
export class FindCustomerUseCase {
  constructor(private readonly repository: PickupDeliveryRepository) {}

  call(userId: number) {
    return this.repository.findUser(userId);
  }
}
