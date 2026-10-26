import { Injectable } from '@nestjs/common';
import { AcceptDeliveryRepository } from '../repositories/accept_delivery.repository';

@Injectable()
export class CreateOrderNotificationUseCase {
  constructor(private readonly repository: AcceptDeliveryRepository) {}

  call(data: {
    orderId: number;
    fromUserId: number;
    toUserId?: number;
    message: string;
    type: string;
  }) {
    return this.repository.createNotification(data);
  }
}
