import { Injectable } from '@nestjs/common';
import { PickupDeliveryRepository } from '../repositories/pickup_delivery.repository';

@Injectable()
export class CreatePickupNotificationUseCase {
  constructor(private readonly repository: PickupDeliveryRepository) {}

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
