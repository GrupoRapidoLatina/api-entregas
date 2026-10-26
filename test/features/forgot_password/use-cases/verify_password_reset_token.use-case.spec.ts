import { UnauthorizedException } from '@nestjs/common';
import { VerifyPasswordResetTokenUseCase } from '../../../../src/features/forgot_password/use-cases/verify_password_reset_token.use-case';
import type { TokenService } from '../../../../src/core/auth/services/token.service';

describe('VerifyPasswordResetTokenUseCase', () => {
  it('devolve o usuário e o instante do token válido', () => {
    const tokens = {
      verifyPasswordReset: () => ({
        userId: 7,
        email: 'ana@example.com',
        iat: 100,
      }),
    } as unknown as TokenService;

    expect(new VerifyPasswordResetTokenUseCase(tokens).call('tok')).toEqual({
      userId: 7,
      email: 'ana@example.com',
      iat: 100,
    });
  });

  it('propaga token inválido ou expirado', () => {
    const tokens = {
      verifyPasswordReset: () => {
        throw new UnauthorizedException(
          'Link inválido ou expirado. Solicite a recuperação novamente.',
        );
      },
    } as unknown as TokenService;

    expect(() => new VerifyPasswordResetTokenUseCase(tokens).call('ruim')).toThrow(
      'Link inválido ou expirado',
    );
  });
});
