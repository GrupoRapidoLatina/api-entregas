import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import type { StringValue } from 'ms';
import { SessionAuthService } from './services/session-auth.service';
import { TokenService } from './services/token.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'rapido-entregas-dev-secret',
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue,
        },
      }),
    }),
  ],
  providers: [
    SessionAuthService,
    TokenService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [SessionAuthService, TokenService, JwtModule],
})
export class SessionAuthModule {}
