import { Module } from '@nestjs/common';
import { CustomerHistoryController } from './customer_history.controller';
import { CustomerHistoryUseCase } from './use-cases/customer_history.use-case';
import { CustomerHistoryRepository } from './repositories/customer_history.repository';

@Module({
  controllers: [CustomerHistoryController],
  providers: [CustomerHistoryUseCase, CustomerHistoryRepository],
})
export class CustomerHistoryModule {}
