import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsUseCase } from './use-cases/notifications.use-case';
import { NotificationsRepository } from './repositories/notifications.repository';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsUseCase, NotificationsRepository],
})
export class NotificationsModule {}
