import { Injectable } from '@nestjs/common';
import { imageUrl } from '../../../core/helpers/image-url.helper';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class FindDriverDeliveryAlertUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

  async call(driverId: number) {
    if (!driverId) {
      return { name: '', image: '', rating: '0' };
    }
    const driver = await this.repository.findUser(driverId);
    const rating = await this.repository.averageDriverRating(driverId);
    const name = [driver?.firstname, driver?.lastname]
      .filter((part) => part?.trim())
      .join(' ');
    return {
      name,
      image: imageUrl(driver?.profileImage),
      rating,
    };
  }
}
