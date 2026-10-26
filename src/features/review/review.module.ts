import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewUseCase } from './use-cases/review.use-case';
import { ReviewRepository } from './repositories/review.repository';

@Module({
  controllers: [ReviewController],
  providers: [ReviewUseCase, ReviewRepository],
})
export class ReviewModule {}
