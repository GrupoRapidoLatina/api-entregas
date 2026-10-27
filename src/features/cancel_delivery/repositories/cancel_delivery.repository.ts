import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import {
  toNotificationCreate,
  type CreateNotificationInput,
} from '../../notifications/models/create-notification.input';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';

@Injectable()
export class CancelDeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUser(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  findOrderByOrderId(orderId: string) {
    return this.prisma.order.findFirst({ where: { orderId } });
  }

  cancelAsCustomer(orderId: string, userId: number) {
    return this.prisma.order.updateMany({
      where: { orderId, userId },
      data: { deliveryStatus: DeliveryStatus.PedidoCancelado, driverId: 0 },
    });
  }

  cancelAsDriver(orderId: string, userId: number) {
    return this.prisma.order.updateMany({
      where: { orderId, driverId: userId },
      data: { deliveryStatus: DeliveryStatus.Available, driverId: 0 },
    });
  }

  createNotification(data: CreateNotificationInput) {
    return this.prisma.notification.create({ data: toNotificationCreate(data) });
  }
}
