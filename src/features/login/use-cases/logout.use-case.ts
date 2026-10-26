import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { LoginRepository } from '../repositories/login.repository';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly repository: LoginRepository) { }

  async call(userId: number) {
    await this.repository.clearSession(userId);
    return ok();
  }
}
