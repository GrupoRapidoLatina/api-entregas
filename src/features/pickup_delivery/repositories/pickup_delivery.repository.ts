import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import {
  toNotificationCreate,
  type CreateNotificationInput,
} from '../../notifications/models/create-notification.input';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';

@Injectable()
export class PickupDeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.order.findMany({ where: { id } });
  }

  updatePickup(id: number, userId: number) {
    return this.prisma.order.update({
      where: { id },
      data: { driverId: userId, deliveryStatus: DeliveryStatus.InProgress },
    });
  }

  createHistorico(data: Prisma.OrderHistoricoCreateInput) {
    return this.prisma.orderHistorico.create({ data });
  }

  createNotification(data: CreateNotificationInput) {
    return this.prisma.notification.create({ data: toNotificationCreate(data) });
  }

  findUser(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }
}
