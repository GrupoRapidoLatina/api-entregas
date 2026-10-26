import { Injectable } from '@nestjs/common';
import { CancelDeliveryRepository } from '../repositories/cancel_delivery.repository';

@Injectable()
export class CancelAsCustomerUseCase {
  constructor(private readonly repository: CancelDeliveryRepository) {}

  call(orderId: string, userId: number) {
    return this.repository.cancelAsCustomer(orderId, userId);
  }
}
