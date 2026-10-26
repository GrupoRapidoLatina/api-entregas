import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { ReviewDto } from '../dto/review.dto';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  async call(dto: ReviewDto) {
    const rating = String(dto.driverRatting ?? 0);
    const feedback = dto.feedback ?? '';
    await this.repository.createReview({
      orderId: dto.order_id,
      customerId: dto.customer_id ?? 0,
      driverId: dto.driver_id ?? 0,
      driverRatting: rating,
      feedback,
      message: feedback,
      serviceRatting: rating,
    });
    return ok();
  }
}
