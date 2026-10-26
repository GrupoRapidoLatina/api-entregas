import { Injectable } from '@nestjs/common';
import { CancelDeliveryRepository } from '../repositories/cancel_delivery.repository';

@Injectable()
export class CancelAsDriverUseCase {
  constructor(private readonly repository: CancelDeliveryRepository) {}

  call(orderId: string, userId: number) {
    return this.repository.cancelAsDriver(orderId, userId);
  }
}
