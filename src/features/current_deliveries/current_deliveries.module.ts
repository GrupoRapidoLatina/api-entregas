import { Module } from '@nestjs/common';
import { CurrentDeliveriesController } from './current_deliveries.controller';
import { DriverDeliveriesUseCase } from './use-cases/driver_deliveries.use-case';
import { UserDeliveriesUseCase } from './use-cases/user_deliveries.use-case';
import { CurrentDeliveriesRepository } from './repositories/current_deliveries.repository';

@Module({
  controllers: [CurrentDeliveriesController],
  providers: [
    DriverDeliveriesUseCase,
    UserDeliveriesUseCase,
    CurrentDeliveriesRepository,
  ],
})
export class CurrentDeliveriesModule {}
