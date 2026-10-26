import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { DeliveryStatusGroup } from '../../../core/shared/enums/delivery-status-group';

@Injectable()
export class CustomerHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findHistory(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
        deliveryStatus: { in: [...DeliveryStatusGroup.customerHistory] },
      },
      orderBy: { id: 'desc' },
    });
  }
}
