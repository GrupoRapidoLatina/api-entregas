import { Injectable } from '@nestjs/common';
import { DeviceType } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';
import { UserStatus } from '../../../core/shared/enums/user-status.enum';

@Injectable()
export class LoginRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveByCredentials(email: string, password: string) {
    return this.prisma.user.findFirst({
      where: { email, password, userStatus: UserStatus.Active },
    });
  }

  updateSession(
    userId: number,
    data: {
      deviceToken: string;
      deviceType: DeviceType | null;
      latitude: string;
      longitude: string;
      loginStatus: string;
    },
  ) {
    return this.prisma.user.update({
      where: { userId },
      data,
    });
  }

  clearSession(userId: number) {
    return this.prisma.user.updateMany({
      where: { userId },
      data: { loginStatus: 'no', deviceToken: '' },
    });
  }
}
