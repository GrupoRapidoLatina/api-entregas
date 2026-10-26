import { Injectable } from '@nestjs/common';
import { ChangePasswordRepository } from '../repositories/change_password.repository';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(private readonly repository: ChangePasswordRepository) {}

  call(userId: number, newPassword: string) {
    return this.repository.updatePassword(userId, newPassword);
  }
}
