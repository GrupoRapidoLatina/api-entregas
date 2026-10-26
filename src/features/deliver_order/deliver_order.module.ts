import { Module } from '@nestjs/common';
import { DeliverOrderController } from './deliver_order.controller';
import { ResolveDeliveryStatusUseCase } from './use-cases/resolve_delivery_status.use-case';
import { MarkOrderDeliveredUseCase } from './use-cases/mark_order_delivered.use-case';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { CreateDeliveryHistoricoUseCase } from './use-cases/create_delivery_historico.use-case';
import { CreateDeliveryNotificationUseCase } from './use-cases/create_delivery_notification.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { FindDriverDeliveryAlertUseCase } from './use-cases/find_driver_delivery_alert.use-case';
import { DeliverOrderRepository } from './repositories/deliver_order.repository';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [StatusModule],
  controllers: [DeliverOrderController],
  providers: [
    ResolveDeliveryStatusUseCase,
    MarkOrderDeliveredUseCase,
    FindOrderUseCase,
    CreateDeliveryHistoricoUseCase,
    CreateDeliveryNotificationUseCase,
    FindCustomerUseCase,
    FindDriverDeliveryAlertUseCase,
    DeliverOrderRepository,
  ],
})
export class DeliverOrderModule {}
