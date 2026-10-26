import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class ChangePasswordRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByIdAndPassword(userId: number, password: string) {
    return this.prisma.user.findFirst({
      where: { userId, password },
    });
  }

  updatePassword(userId: number, password: string) {
    return this.prisma.user.update({
      where: { userId },
      data: { password },
    });
  }
}
