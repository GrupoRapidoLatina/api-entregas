import { VerifyEmailUseCase } from '../../../../src/features/verify_email/use-cases/verify_email.use-case';
import type { VerifyEmailRepository } from '../../../../src/features/verify_email/repositories/verify_email.repository';

describe('VerifyEmailUseCase', () => {
  it('ativa a conta quando o código confere', async () => {
    const activated: number[] = [];
    const repository = {
      findByEmail: async () => ({
        userId: 7,
        email: 'ana@example.com',
        verify: '1234',
      }),
      markActive: async (userId: number) => {
        activated.push(userId);
      },
    } as unknown as VerifyEmailRepository;

    await expect(
      new VerifyEmailUseCase(repository).call('ana@example.com', '1234'),
    ).resolves.toEqual({
      success: true,
      data: { email: 'ana@example.com', verified: true },
    });
    expect(activated).toEqual([7]);
  });

  it('recusa dados ausentes, e-mail inexistente ou código errado', async () => {
    const repository = {
      findByEmail: async (email: string) =>
        email === 'ana@example.com'
          ? { userId: 7, email, verify: '1234' }
          : null,
      markActive: async () => undefined,
    } as unknown as VerifyEmailRepository;
    const useCase = new VerifyEmailUseCase(repository);

    await expect(useCase.call('', '')).rejects.toThrow(
      'email e code são obrigatórios',
    );
    await expect(useCase.call('sumiu@example.com', '1234')).rejects.toThrow(
      'E-mail não encontrado!',
    );
    await expect(useCase.call('ana@example.com', '0000')).rejects.toThrow(
      'Código de verificação inválido',
    );
  });
});
