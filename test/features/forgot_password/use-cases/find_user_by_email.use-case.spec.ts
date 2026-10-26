import { FindUserByEmailUseCase } from '../../../../src/features/forgot_password/use-cases/find_user_by_email.use-case';
import type { ForgotPasswordRepository } from '../../../../src/features/forgot_password/repositories/forgot_password.repository';
import { UserStatus } from '../../../../src/core/shared/enums/user-status.enum';

describe('FindUserByEmailUseCase', () => {
  it('devolve o usuário ativo', async () => {
    const user = {
      userId: 7,
      email: 'ana@example.com',
      userStatus: UserStatus.Active,
    };
    const repository = {
      findByEmail: async () => user,
    } as unknown as ForgotPasswordRepository;

    await expect(
      new FindUserByEmailUseCase(repository).call('ana@example.com'),
    ).resolves.toBe(user);
  });

  it('recusa e-mail inexistente ou conta suspensa', async () => {
    const missing = {
      findByEmail: async () => null,
    } as unknown as ForgotPasswordRepository;
    const suspended = {
      findByEmail: async () => ({
        userId: 7,
        email: 'ana@example.com',
        userStatus: UserStatus.PendingDriver,
      }),
    } as unknown as ForgotPasswordRepository;

    await expect(
      new FindUserByEmailUseCase(missing).call('sumiu@example.com'),
    ).rejects.toThrow('E-mail não encontrado!');
    await expect(
      new FindUserByEmailUseCase(suspended).call('ana@example.com'),
    ).rejects.toThrow('sua conta está suspensa');
  });
});
