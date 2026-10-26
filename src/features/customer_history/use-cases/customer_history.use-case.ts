import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { toOrderResponse } from '../../../core/shared/order.mapper';
import { CustomerHistoryRepository } from '../repositories/customer_history.repository';

@Injectable()
export class CustomerHistoryUseCase {
  constructor(private readonly repository: CustomerHistoryRepository) { }

  async call(userId: number) {
    const orders = await this.repository.findHistory(userId);
    return ok(orders.map((order) => toOrderResponse(order)));
  }
}
