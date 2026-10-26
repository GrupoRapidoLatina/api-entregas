import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordRepository } from '../repositories/change_password.repository';

@Injectable()
export class ValidateOldPasswordUseCase {
  constructor(private readonly repository: ChangePasswordRepository) {}

  async call(userId: number, oldPassword: string) {
    const user = await this.repository.findByIdAndPassword(userId, oldPassword);
    if (!user) {
      throw new UnauthorizedException('Senha antiga inválida!');
    }
    return user;
  }
}
