import { ValidatePasswordResetRequestUseCase } from '../../../../src/features/forgot_password/use-cases/validate_password_reset_request.use-case';
import type { ForgotPasswordRepository } from '../../../../src/features/forgot_password/repositories/forgot_password.repository';

function useCase(forgetTime: string | null) {
  const repository = {
    findByEmail: async () =>
      forgetTime === undefined ? null : { forgetTime },
  } as unknown as ForgotPasswordRepository;
  return new ValidatePasswordResetRequestUseCase(repository);
}

describe('ValidatePasswordResetRequestUseCase', () => {
  it('aceita token emitido junto com o pedido de redefinição', async () => {
    const issuedAt = Math.floor(Date.parse('2026-09-30T12:00:00Z') / 1000);
    await expect(
      useCase('2026-09-30 12:00:00').call('ana@example.com', issuedAt),
    ).resolves.toBeUndefined();
  });

  it('recusa pedido sem horário ou link anterior ao pedido', async () => {
    await expect(
      useCase(null).call('ana@example.com', 1),
    ).rejects.toThrow('tente novamente a solicitação');

    const issuedAt = Math.floor(Date.parse('2026-09-30T11:00:00Z') / 1000);
    await expect(
      useCase('2026-09-30 12:00:00').call('ana@example.com', issuedAt),
    ).rejects.toThrow('Este link expirou');
  });
});
