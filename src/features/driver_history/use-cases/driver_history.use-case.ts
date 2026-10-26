import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { toOrderResponse } from '../../../core/shared/order.mapper';
import { DriverHistoryRepository } from '../repositories/driver_history.repository';

@Injectable()
export class DriverHistoryUseCase {
  constructor(private readonly repository: DriverHistoryRepository) { }

  async call(userId: number) {
    const orders = await this.repository.findHistory(userId);
    return ok(orders.map((order) => toOrderResponse(order)));
  }
}
