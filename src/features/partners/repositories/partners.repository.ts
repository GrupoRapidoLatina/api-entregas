import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class PartnersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveByCnpj(cnpj: string) {
    return this.prisma.operacao.findMany({
      where: { cgc: cnpj, ativo: 'S' },
    });
  }
}
