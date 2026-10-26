import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';

@Injectable()
export class DeleteAccountUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  call(userId: number) {
    return this.repository.deactivateAccount(userId);
  }
}
