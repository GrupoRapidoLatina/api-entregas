import { Module } from '@nestjs/common';
import { AcceptDeliveryController } from './accept_delivery.controller';
import { FindUnassignedOrderUseCase } from './use-cases/find_unassigned_order.use-case';
import { AssignDriverUseCase } from './use-cases/assign_driver.use-case';
import { CreateOrderNotificationUseCase } from './use-cases/create_order_notification.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { AcceptDeliveryRepository } from './repositories/accept_delivery.repository';

@Module({
  controllers: [AcceptDeliveryController],
  providers: [
    FindUnassignedOrderUseCase,
    AssignDriverUseCase,
    CreateOrderNotificationUseCase,
    FindCustomerUseCase,
    AcceptDeliveryRepository,
  ],
})
export class AcceptDeliveryModule {}
