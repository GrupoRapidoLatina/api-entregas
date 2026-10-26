import { Injectable } from '@nestjs/common';
import { TokenService } from '../../../core/auth/services/token.service';

@Injectable()
export class VerifyPasswordResetTokenUseCase {
  constructor(private readonly tokenService: TokenService) { }

  call(token: string) {
    return this.tokenService.verifyPasswordReset(token);
  }
}
