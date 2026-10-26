import { Injectable } from '@nestjs/common';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class FindOrderUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

  call(id: number) {
    return this.repository.findById(id);
  }
}
