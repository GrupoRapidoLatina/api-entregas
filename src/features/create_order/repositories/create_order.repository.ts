import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import { parseOptionalDate } from '../../../core/helpers/date.helper';

@Injectable()
export class CreateOrderRepository {
  constructor(private readonly prisma: PrismaService) { }

  findUser(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  findPrices() {
    return this.prisma.setting.findFirst();
  }

  async createOrder(data: Prisma.OrderCreateInput) {
    const created = await this.prisma.order.create({ data });
    const orderId = String(created.id);
    await this.prisma.order.update({
      where: { id: created.id },
      data: { orderId, nfChave: created.nfChave || orderId },
    });
    return { ...created, orderId };
  }

  rescheduleOrder(orderId: string, deliveryDate: string, deliveryTime: string) {
    return this.prisma.order.updateMany({
      where: { orderId },
      data: { deliveryDate: parseOptionalDate(deliveryDate), deliveryTime },
    });
  }

  updatePdfUrl(id: number, pdfUrl: string) {
    return this.prisma.order.update({
      where: { id },
      data: { pdfUrl },
    });
  }
}
