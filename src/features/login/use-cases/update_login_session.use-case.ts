import { Injectable } from '@nestjs/common';
import { DeviceType } from '@prisma/client';
import { LoginRepository } from '../repositories/login.repository';

@Injectable()
export class UpdateLoginSessionUseCase {
  constructor(private readonly repository: LoginRepository) {}

  call(
    userId: number,
    data: {
      deviceToken: string;
      deviceType: DeviceType | null;
      latitude: string;
      longitude: string;
      loginStatus: string;
    },
  ) {
    return this.repository.updateSession(userId, data);
  }
}
