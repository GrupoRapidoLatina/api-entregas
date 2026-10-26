import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { VerifyEmailRepository } from '../repositories/verify_email.repository';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly repository: VerifyEmailRepository) { }

  async call(email: string, code: string) {
    if (!email || !code) {
      throw new BadRequestException('email e code são obrigatórios');
    }

    const user = await this.repository.findByEmail(email);
    if (!user) throw new NotFoundException('E-mail não encontrado!');

    if (String(user.verify ?? '') !== String(code)) {
      throw new BadRequestException('Código de verificação inválido');
    }

    await this.repository.markActive(user.userId);
    return ok({ email: user.email, verified: true });
  }
}
