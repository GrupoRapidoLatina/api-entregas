import { Injectable } from '@nestjs/common';
import { AcceptDeliveryRepository } from '../repositories/accept_delivery.repository';

@Injectable()
export class FindCustomerUseCase {
  constructor(private readonly repository: AcceptDeliveryRepository) {}

  call(userId: number) {
    return this.repository.findUser(userId);
  }
}
