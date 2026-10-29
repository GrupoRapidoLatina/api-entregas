import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import { parseOptionalDate } from '../../../core/helpers/date.helper';
import {
  toNotificationCreate,
  type CreateNotificationInput,
} from '../../notifications/models/create-notification.input';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';

@Injectable()
export class DeliverOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findStatusByMicroStatus(microStatus: string) {
    return this.prisma.status.findFirst({
      where: { microStatus },
    });
  }

  updateDelivered(
    id: number,
    data: {
      receivedUserImage?: string;
      updateImagem?: string;
      signatureImage?: string;
      signatureName: string;
      latitudeFoto: string;
      longitudeFoto: string;
      updateLat: string;
      updateLon: string;
      deliveryStatus: DeliveryStatus;
      dataEntregue: string;
    },
  ) {
    return this.prisma.order.update({
      where: { id },
      data: {
        receivedUserImage: data.receivedUserImage,
        updateImagem: data.updateImagem,
        signatureImage: data.signatureImage,
        signatureName: data.signatureName,
        latitudeFoto: data.latitudeFoto,
        longitudeFoto: data.longitudeFoto,
        updateLat: data.updateLat,
        updateLon: data.updateLon,
        deliveryStatus: data.deliveryStatus,
        dataEntregue: parseOptionalDate(data.dataEntregue),
      },
    });
  }

  findById(id: number) {
    return this.prisma.order.findUnique({ where: { id } });
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

  async averageDriverRating(driverId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { driverId },
      select: { driverRatting: true },
    });
    const ratings = reviews
      .map((review) => Number(review.driverRatting))
      .filter((rating) => Number.isFinite(rating));
    if (!ratings.length) return '0';
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1);
  }
}
