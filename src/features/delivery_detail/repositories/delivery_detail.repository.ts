import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class DeliveryDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.order.findFirst({ where: { id } });
  }

  findByOrderId(orderId: string) {
    return this.prisma.order.findFirst({ where: { orderId } });
  }
}
