import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import type { CreateUserInput } from '../models/create-user.input';

@Injectable()
export class RegisterRepository {
  constructor(private readonly prisma: PrismaService) { }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  findByUserId(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  createUser(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }

  updateImages(userId: number, data: Record<string, string>) {
    return this.prisma.user.update({ where: { userId }, data });
  }
}
