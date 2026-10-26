import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class StatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.status.findMany({
      where: { ativo: 'S' },
      orderBy: { codigo: 'asc' },
    });
  }

  findActiveProblems() {
    return this.prisma.status.findMany({
      where: {
        ativo: 'S',
        OR: [
          { macroStatus: 'FALHA NA ENTREGA' },
          { macroStatus: 'AVERIGUAR FALHA NA ENTREGA' },
        ],
      },
      orderBy: { codigo: 'asc' },
    });
  }

  findByMicroStatus(microStatus: string) {
    return this.prisma.status.findFirst({
      where: { microStatus, ativo: 'S' },
    });
  }
}
