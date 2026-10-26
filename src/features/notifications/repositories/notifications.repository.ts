import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: number) {
    return this.prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT o.*, n.id AS notification_id, n.type AS notification_type,
         n.message AS notification_message,
         u.firstname, u.lastname, u.profile_image,
         n.to_user_id AS user_id
      FROM notifications n
      LEFT JOIN orders o ON o.id = n.order_id
      LEFT JOIN user u ON n.from_user_id = u.user_id
      WHERE n.to_user_id = ${userId}
      ORDER BY n.id DESC
    `;
  }
}
