import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class ForgotPasswordRepository {
  constructor(private readonly prisma: PrismaService) { }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  updateForgetTime(userId: number, forgetTime: string) {
    return this.prisma.user.update({
      where: { userId },
      data: { forgetTime },
    });
  }

  updatePasswordByEmail(email: string, password: string) {
    return this.prisma.user.updateMany({
      where: { email },
      data: { password, forgetTime: null },
    });
  }
}
