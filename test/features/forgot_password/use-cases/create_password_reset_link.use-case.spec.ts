import { CreatePasswordResetLinkUseCase } from '../../../../src/features/forgot_password/use-cases/create_password_reset_link.use-case';
import type { TokenService } from '../../../../src/core/auth/services/token.service';

describe('CreatePasswordResetLinkUseCase', () => {
  const previous = process.env.APP_RESET_DEEP_LINK;

  afterEach(() => {
    if (previous === undefined) delete process.env.APP_RESET_DEEP_LINK;
    else process.env.APP_RESET_DEEP_LINK = previous;
  });

  it('monta o link com o token de redefinição', () => {
    process.env.APP_RESET_DEEP_LINK = 'rapidoentregas://reset-password/';
    const tokens = {
      signPasswordReset: (userId: number, email: string) =>
        `tok-${userId}-${email}`,
    } as unknown as TokenService;

    const result = new CreatePasswordResetLinkUseCase(tokens).call(
      7,
      'ana@example.com',
    );

    expect(result.token).toBe('tok-7-ana@example.com');
    expect(result.resetUrl).toBe(
      'rapidoentregas://reset-password?token=tok-7-ana%40example.com',
    );
  });
});
