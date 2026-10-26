import { Module } from '@nestjs/common';
import { DeliveryDetailController } from './delivery_detail.controller';
import { DeliveryDetailUseCase } from './use-cases/delivery_detail.use-case';
import { DeliveryDetailRepository } from './repositories/delivery_detail.repository';

@Module({
  controllers: [DeliveryDetailController],
  providers: [DeliveryDetailUseCase, DeliveryDetailRepository],
})
export class DeliveryDetailModule {}
