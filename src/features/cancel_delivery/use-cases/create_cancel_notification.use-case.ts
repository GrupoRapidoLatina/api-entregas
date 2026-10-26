import { Injectable } from '@nestjs/common';
import { CancelDeliveryRepository } from '../repositories/cancel_delivery.repository';

@Injectable()
export class CreateCancelNotificationUseCase {
  constructor(private readonly repository: CancelDeliveryRepository) {}

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
