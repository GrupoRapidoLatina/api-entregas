import { Module } from '@nestjs/common';
import { CreateOrderController } from './create_order.controller';
import { CreateOrderUseCase } from './use-cases/create_order.use-case';
import { ResolveDeliveryPriceUseCase } from './use-cases/resolve_delivery_price.use-case';
import { RescheduleOrderUseCase } from './use-cases/reschedule_order.use-case';
import { CreateOrderRepository } from './repositories/create_order.repository';

@Module({
  controllers: [CreateOrderController],
  providers: [
    ResolveDeliveryPriceUseCase,
    CreateOrderUseCase,
    RescheduleOrderUseCase,
    CreateOrderRepository,
  ],
})
export class CreateOrderModule {}
