import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { UserStatus } from '../../../core/shared/enums/user-status.enum';

@Injectable()
export class VerifyEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  markActive(userId: number) {
    return this.prisma.user.update({
      where: { userId },
      data: { userStatus: UserStatus.Active },
    });
  }
}
