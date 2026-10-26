import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { DeliveryStatusGroup } from '../../../core/shared/enums/delivery-status-group';

@Injectable()
export class CurrentDeliveriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findDriverDeliveries(userId: number) {
    return this.prisma.order.findMany({
      where: {
        driverId: userId,
        deliveryStatus: { in: [...DeliveryStatusGroup.driverCurrent] },
      },
      orderBy: { id: 'desc' },
    });
  }

  findUserDeliveries(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
        deliveryStatus: { in: [...DeliveryStatusGroup.customerCurrent] },
      },
      orderBy: { id: 'desc' },
    });
  }
}
