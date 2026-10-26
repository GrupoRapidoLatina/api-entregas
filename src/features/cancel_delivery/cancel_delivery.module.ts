import { Module } from '@nestjs/common';
import { CancelDeliveryController } from './cancel_delivery.controller';
import { GetUserTypeUseCase } from './use-cases/get_user_type.use-case';
import { CancelAsCustomerUseCase } from './use-cases/cancel_as_customer.use-case';
import { CancelAsDriverUseCase } from './use-cases/cancel_as_driver.use-case';
import { CreateCancelNotificationUseCase } from './use-cases/create_cancel_notification.use-case';
import { CancelDeliveryRepository } from './repositories/cancel_delivery.repository';

@Module({
  controllers: [CancelDeliveryController],
  providers: [
    GetUserTypeUseCase,
    CancelAsCustomerUseCase,
    CancelAsDriverUseCase,
    CreateCancelNotificationUseCase,
    CancelDeliveryRepository,
  ],
})
export class CancelDeliveryModule { }
