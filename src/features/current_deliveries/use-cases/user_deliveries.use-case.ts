import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { toOrderResponse } from '../../../core/shared/order.mapper';
import { CurrentDeliveriesRepository } from '../repositories/current_deliveries.repository';

@Injectable()
export class UserDeliveriesUseCase {
  constructor(private readonly repository: CurrentDeliveriesRepository) { }

  async call(userId: number) {
    const orders = await this.repository.findUserDeliveries(userId);
    return ok(orders.map((order) => toOrderResponse(order)));
  }
}
