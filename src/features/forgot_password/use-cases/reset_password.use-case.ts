import { Injectable } from '@nestjs/common';
import { ForgotPasswordRepository } from '../repositories/forgot_password.repository';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly repository: ForgotPasswordRepository) { }

  call(email: string, password: string) {
    return this.repository.updatePasswordByEmail(email, password);
  }
}
