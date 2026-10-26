import { Injectable, NotFoundException } from '@nestjs/common';
import { PickupDeliveryRepository } from '../repositories/pickup_delivery.repository';

@Injectable()
export class FindOrderUseCase {
  constructor(private readonly repository: PickupDeliveryRepository) {}

  async call(id: number) {
    const orders = await this.repository.findById(id);
    if (!orders.length) throw new NotFoundException('Pedido não encontrado');
    return orders[0];
  }
}
