import { Injectable } from '@nestjs/common';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class FindCustomerUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

  call(userId: number) {
    return this.repository.findUser(userId);
  }
}
