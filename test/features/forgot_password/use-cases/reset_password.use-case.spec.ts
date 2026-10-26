import { ResetPasswordUseCase } from '../../../../src/features/forgot_password/use-cases/reset_password.use-case';
import type { ForgotPasswordRepository } from '../../../../src/features/forgot_password/repositories/forgot_password.repository';

describe('ResetPasswordUseCase', () => {
  it('atualiza a senha pelo e-mail', async () => {
    const calls: Array<{ email: string; password: string }> = [];
    const repository = {
      updatePasswordByEmail: async (email: string, password: string) => {
        calls.push({ email, password });
        return { count: 1 };
      },
    } as unknown as ForgotPasswordRepository;

    await expect(
      new ResetPasswordUseCase(repository).call('ana@example.com', 'nova12345'),
    ).resolves.toEqual({ count: 1 });
    expect(calls).toEqual([
      { email: 'ana@example.com', password: 'nova12345' },
    ]);
  });
});
