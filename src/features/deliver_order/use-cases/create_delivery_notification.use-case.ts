import { Injectable } from '@nestjs/common';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class CreateDeliveryNotificationUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

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
