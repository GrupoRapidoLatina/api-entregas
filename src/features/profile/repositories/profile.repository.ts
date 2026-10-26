import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  updateProfile(userId: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { userId }, data });
  }

  deactivateAccount(userId: number) {
    return this.prisma.user.update({
      where: { userId },
      data: { userStatus: 0, loginStatus: 'no', deviceToken: '' },
    });
  }
}
