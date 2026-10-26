import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class CreateDeliveryHistoricoUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

  call(data: Prisma.OrderHistoricoCreateInput) {
    return this.repository.createHistorico(data);
  }
}
