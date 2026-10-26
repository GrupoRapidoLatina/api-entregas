import { BadRequestException, Injectable } from '@nestjs/common';
import { AcceptDeliveryRepository } from '../repositories/accept_delivery.repository';

@Injectable()
export class FindUnassignedOrderUseCase {
  constructor(private readonly repository: AcceptDeliveryRepository) {}

  async call(orderId: string) {
    const order = await this.repository.findUnassignedByOrderId(orderId);
    if (!order) {
      throw new BadRequestException('Não aceito !');
    }
    return order;
  }
}
