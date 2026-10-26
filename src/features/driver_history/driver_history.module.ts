import { Module } from '@nestjs/common';
import { DriverHistoryController } from './driver_history.controller';
import { DriverHistoryUseCase } from './use-cases/driver_history.use-case';
import { DriverHistoryRepository } from './repositories/driver_history.repository';

@Module({
  controllers: [DriverHistoryController],
  providers: [DriverHistoryUseCase, DriverHistoryRepository],
})
export class DriverHistoryModule {}
