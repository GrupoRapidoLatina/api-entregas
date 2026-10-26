import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserStatus } from '../../shared/enums/user-status.enum';
import { ActiveUser } from '../models/active-user.model';

@Injectable()
export class SessionAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveUser(userId: number): Promise<ActiveUser | null> {
    if (!Number.isFinite(userId) || userId <= 0) return null;
    const user = await this.prisma.user.findFirst({
      where: { userId, userStatus: UserStatus.Active },
      select: {
        userId: true,
        userType: true,
        userStatus: true,
        loginStatus: true,
        deviceToken: true,
        email: true,
      },
    });
    if (!user) return null;
    return user;
  }

  async requireActiveUser(userId: number): Promise<ActiveUser> {
    const user = await this.findActiveUser(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário inválido ou inativo!');
    }
    return user;
  }
}
