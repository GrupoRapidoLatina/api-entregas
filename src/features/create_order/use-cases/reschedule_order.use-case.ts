import { Injectable, NotFoundException } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { RescheduleOrderDto } from '../dto/reschedule_order.dto';
import { CreateOrderRepository } from '../repositories/create_order.repository';

@Injectable()
export class RescheduleOrderUseCase {
  constructor(private readonly repository: CreateOrderRepository) { }

  async call(dto: RescheduleOrderDto) {
    const orderId = dto.order_id ?? '';
    const deliveryDate = dto.delivery_date ?? '';
    const deliveryTime = dto.delivery_time ?? '';
    const updated = await this.repository.rescheduleOrder(
      orderId,
      deliveryDate,
      deliveryTime,
    );
    if (!updated.count) throw new NotFoundException('Pedido não encontrado');
    return ok();
  }
}
