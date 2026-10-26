import { Module } from '@nestjs/common';
import { PickupDeliveryController } from './pickup_delivery.controller';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { MarkPickupUseCase } from './use-cases/mark_pickup.use-case';
import { CreatePickupHistoricoUseCase } from './use-cases/create_pickup_historico.use-case';
import { CreatePickupNotificationUseCase } from './use-cases/create_pickup_notification.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { PickupDeliveryRepository } from './repositories/pickup_delivery.repository';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [StatusModule],
  controllers: [PickupDeliveryController],
  providers: [
    FindOrderUseCase,
    MarkPickupUseCase,
    CreatePickupHistoricoUseCase,
    CreatePickupNotificationUseCase,
    FindCustomerUseCase,
    PickupDeliveryRepository,
  ],
})
export class PickupDeliveryModule {}
