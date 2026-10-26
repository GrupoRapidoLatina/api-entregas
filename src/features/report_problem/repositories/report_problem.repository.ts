import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';
import type { MarkOrderAfterReportParams } from '../models/mark-order-after-report.params';

@Injectable()
export class ReportProblemRepository {
  constructor(private readonly prisma: PrismaService) {}

  createReport(data: Prisma.DriverReportCreateInput) {
    return this.prisma.driverReport.create({ data });
  }

  findOrderById(id: number) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  findStatusByMicroStatus(microStatus: string) {
    return this.prisma.status.findFirst({ where: { microStatus } });
  }

  updateOrderAfterReport(id: number, data: MarkOrderAfterReportParams) {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  createHistorico(data: Prisma.OrderHistoricoCreateInput) {
    return this.prisma.orderHistorico.create({ data });
  }

  findUser(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  resetOrderToReportStatus(userId: number, orderId: string) {
    return this.prisma.order.updateMany({
      where: { userId, orderId },
      data: { driverId: 0, deliveryStatus: DeliveryStatus.Available },
    });
  }
}
