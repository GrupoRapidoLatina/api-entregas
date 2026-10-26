import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { JwtPayload } from '../models/jwt-payload.model';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) { }

  sign(userId: number, userType: number | null): string {
    const payload: JwtPayload = { sub: userId, userType };
    return this.jwt.sign(payload);
  }

  signPasswordReset(userId: number, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      userType: null,
      purpose: 'password_reset',
      email,
    };
    const expiresIn = (process.env.PASSWORD_RESET_EXPIRES_IN ||
      '2h') as StringValue;
    return this.jwt.sign(payload, { expiresIn });
  }

  verify(token: string): JwtPayload {
    return this.jwt.verify<JwtPayload>(token);
  }

  verifyPasswordReset(token: string): {
    userId: number;
    email: string;
    iat: number;
  } {
    try {
      const payload = this.verify(token);
      if (payload.purpose !== 'password_reset' || !payload.email) {
        throw new Error('invalid');
      }
      const userId = Number(payload.sub);
      if (!Number.isFinite(userId) || userId <= 0) {
        throw new Error('invalid');
      }
      const iat = Number(payload.iat);
      if (!Number.isFinite(iat)) {
        throw new Error('invalid');
      }
      return { userId, email: payload.email, iat };
    } catch {
      throw new UnauthorizedException(
        'Link inválido ou expirado. Solicite a recuperação novamente.',
      );
    }
  }
}
