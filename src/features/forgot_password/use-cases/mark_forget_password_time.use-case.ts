import { Injectable } from '@nestjs/common';
import { ForgotPasswordRepository } from '../repositories/forgot_password.repository';

@Injectable()
export class MarkForgetPasswordTimeUseCase {
  constructor(private readonly repository: ForgotPasswordRepository) { }

  call(userId: number) {
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return this.repository.updateForgetTime(userId, datetime);
  }
}
