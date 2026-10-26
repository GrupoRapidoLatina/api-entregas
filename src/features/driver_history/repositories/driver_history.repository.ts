import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { DeliveryStatusGroup } from '../../../core/shared/enums/delivery-status-group';

@Injectable()
export class DriverHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findHistory(userId: number) {
    return this.prisma.order.findMany({
      where: {
        driverId: userId,
        deliveryStatus: { in: [...DeliveryStatusGroup.driverHistory] },
      },
      orderBy: { id: 'desc' },
    });
  }
}
