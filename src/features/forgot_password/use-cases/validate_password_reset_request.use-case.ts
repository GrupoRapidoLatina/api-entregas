import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgotPasswordRepository } from '../repositories/forgot_password.repository';

@Injectable()
export class ValidatePasswordResetRequestUseCase {
  constructor(private readonly repository: ForgotPasswordRepository) { }

  async call(email: string, tokenIssuedAtSec: number) {
    const user = await this.repository.findByEmail(email);
    if (!user?.forgetTime) {
      throw new BadRequestException(
        'algo deu errado. Por favor, tente novamente a solicitação de redefinição de senha',
      );
    }

    const forgetMs = Date.parse(user.forgetTime.replace(' ', 'T') + 'Z');
    
    if (Number.isNaN(forgetMs)) {
      throw new BadRequestException(
        'algo deu errado. Por favor, tente novamente a solicitação de redefinição de senha',
      );
    }

    const forgetSec = Math.floor(forgetMs / 1000);
    if (tokenIssuedAtSec < forgetSec - 2) {
      throw new BadRequestException(
        'Este link expirou. Por favor, reenvie a solicitação de senha',
      );
    }
  }
}
