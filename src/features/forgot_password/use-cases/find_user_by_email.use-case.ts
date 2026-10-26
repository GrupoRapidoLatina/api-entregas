import { Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus } from '../../../core/shared/enums/user-status.enum';
import { ForgotPasswordRepository } from '../repositories/forgot_password.repository';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly repository: ForgotPasswordRepository) { }

  async call(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('E-mail não encontrado!');
    }
    if (user.userStatus != null && user.userStatus !== UserStatus.Active) {
      throw new NotFoundException(
        'sua conta está suspensa, entre em contato com o administrador!',
      );
    }
    return user;
  }
}
