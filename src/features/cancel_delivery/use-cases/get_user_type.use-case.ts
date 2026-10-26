import { Injectable, NotFoundException } from '@nestjs/common';
import { CancelDeliveryRepository } from '../repositories/cancel_delivery.repository';

@Injectable()
export class GetUserTypeUseCase {
  constructor(private readonly repository: CancelDeliveryRepository) {}

  async call(userId: number) {
    const profile = await this.repository.findUser(userId);
    if (!profile) throw new NotFoundException('Usuário inválido');
    return profile.userType;
  }
}
