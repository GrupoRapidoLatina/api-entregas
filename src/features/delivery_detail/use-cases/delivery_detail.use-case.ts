import { Injectable, NotFoundException } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { toOrderResponse } from '../../../core/shared/order.mapper';
import { DeliveryDetailDto } from '../dto/delivery_detail.dto';
import { DeliveryDetailRepository } from '../repositories/delivery_detail.repository';

@Injectable()
export class DeliveryDetailUseCase {
  constructor(private readonly repository: DeliveryDetailRepository) { }

  async call(dto: DeliveryDetailDto) {
    const rawId =
      (dto.id_entrega ?? '') || (dto.delivery_id ?? '') || (dto.order_id ?? '');
    if (!rawId) throw new NotFoundException('Please enter valid user id !');

    const numericId = Number(rawId);
    const order =
      Number.isFinite(numericId) && numericId > 0
        ? (await this.repository.findById(numericId)) ||
          (await this.repository.findByOrderId(rawId))
        : await this.repository.findByOrderId(rawId);

    if (!order) throw new NotFoundException('Please enter valid user id !');
    return ok({
      deliverydata: toOrderResponse(order),
    });
  }
}
