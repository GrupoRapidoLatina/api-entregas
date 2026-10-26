import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusRepository } from './repositories/status.repository';
import { ListStatusesUseCase } from './use-cases/list_statuses.use-case';
import { RequireStatusUseCase } from './use-cases/require_status.use-case';

@Module({
  controllers: [StatusController],
  providers: [StatusRepository, ListStatusesUseCase, RequireStatusUseCase],
  exports: [RequireStatusUseCase],
})
export class StatusModule {}
