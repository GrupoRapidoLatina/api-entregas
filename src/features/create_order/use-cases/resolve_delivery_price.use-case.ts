import { BadRequestException, Injectable } from '@nestjs/common';
import { resolveDeliveryPrice } from '../../../core/helpers/delivery-price.helper';
import { CreateOrderRepository } from '../repositories/create_order.repository';

@Injectable()
export class ResolveDeliveryPriceUseCase {
  constructor(private readonly repository: CreateOrderRepository) {}

  async call(vehicleType?: string | null, deliveryType?: string | null) {
    const setting = await this.repository.findPrices();
    const deliveryCost = setting
      ? resolveDeliveryPrice(setting, vehicleType, deliveryType)
      : null;
    if (!deliveryCost) {
      throw new BadRequestException('Preço da corrida não configurado');
    }
    return deliveryCost;
  }
}
