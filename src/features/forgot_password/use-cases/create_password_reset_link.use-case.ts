import { Injectable } from '@nestjs/common';
import { TokenService } from '../../../core/auth/services/token.service';

@Injectable()
export class CreatePasswordResetLinkUseCase {
  constructor(private readonly tokenService: TokenService) { }

  call(userId: number, email: string) {
    const token = this.tokenService.signPasswordReset(userId, email);
    const deepLinkBase =
      process.env.APP_RESET_DEEP_LINK || 'rapidoentregas://reset-password';
    const resetUrl = `${deepLinkBase.replace(/\/$/, '')}?token=${encodeURIComponent(token)}`;
    return { token, resetUrl };
  }
}
