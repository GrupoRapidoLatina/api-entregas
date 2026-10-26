import { Injectable } from '@nestjs/common';
import { AcceptDeliveryRepository } from '../repositories/accept_delivery.repository';

@Injectable()
export class AssignDriverUseCase {
  constructor(private readonly repository: AcceptDeliveryRepository) {}

  call(orderId: string, userId: number) {
    return this.repository.assignDriver(orderId, userId);
  }
}
