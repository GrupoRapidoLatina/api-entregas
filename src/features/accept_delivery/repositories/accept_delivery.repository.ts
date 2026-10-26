import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import {
  toNotificationCreate,
  type CreateNotificationInput,
} from '../../notifications/models/create-notification.input';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';

@Injectable()
export class AcceptDeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnassignedByOrderId(orderId: string) {
    return this.prisma.order.findFirst({
      where: { orderId, driverId: 0 },
    });
  }

  assignDriver(orderId: string, userId: number) {
    return this.prisma.order.updateMany({
      where: { orderId },
      data: { driverId: userId, deliveryStatus: DeliveryStatus.Accepted },
    });
  }

  createNotification(data: CreateNotificationInput) {
    return this.prisma.notification.create({ data: toNotificationCreate(data) });
  }

  findUser(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }
}
