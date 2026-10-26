import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRepository } from '../repositories/login.repository';

@Injectable()
export class AuthenticateCredentialsUseCase {
  constructor(private readonly repository: LoginRepository) {}

  async call(email: string, password: string) {
    const user = await this.repository.findActiveByCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Senha de login inválida!');
    }
    return user;
  }
}
