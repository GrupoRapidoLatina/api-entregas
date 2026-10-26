import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PickupDeliveryRepository } from '../repositories/pickup_delivery.repository';

@Injectable()
export class CreatePickupHistoricoUseCase {
  constructor(private readonly repository: PickupDeliveryRepository) {}

  call(data: Prisma.OrderHistoricoCreateInput) {
    return this.repository.createHistorico(data);
  }
}
