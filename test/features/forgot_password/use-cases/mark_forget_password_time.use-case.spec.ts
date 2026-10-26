import { MarkForgetPasswordTimeUseCase } from '../../../../src/features/forgot_password/use-cases/mark_forget_password_time.use-case';
import type { ForgotPasswordRepository } from '../../../../src/features/forgot_password/repositories/forgot_password.repository';

describe('MarkForgetPasswordTimeUseCase', () => {
  it('grava o horário do pedido de redefinição', async () => {
    const calls: Array<{ userId: number; forgetTime: string }> = [];
    const repository = {
      updateForgetTime: async (userId: number, forgetTime: string) => {
        calls.push({ userId, forgetTime });
      },
    } as unknown as ForgotPasswordRepository;

    await new MarkForgetPasswordTimeUseCase(repository).call(7);

    expect(calls[0]?.userId).toBe(7);
    expect(calls[0]?.forgetTime).toMatch(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    );
  });
});
