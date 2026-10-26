import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class SettingsPricesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPrices() {
    return this.prisma.setting.findFirst();
  }
}
