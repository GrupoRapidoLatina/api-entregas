import { AuthenticateCredentialsUseCase } from '../../../../src/features/login/use-cases/authenticate_credentials.use-case';
import type { LoginRepository } from '../../../../src/features/login/repositories/login.repository';

describe('AuthenticateCredentialsUseCase', () => {
  it('devolve o usuário ativo com e-mail e senha corretos', async () => {
    const user = { userId: 7, email: 'ana@example.com' };
    const repository = {
      findActiveByCredentials: async (email: string, password: string) =>
        email === 'ana@example.com' && password === 'senha1234' ? user : null,
    } as unknown as LoginRepository;

    await expect(
      new AuthenticateCredentialsUseCase(repository).call(
        'ana@example.com',
        'senha1234',
      ),
    ).resolves.toBe(user);
  });

  it('recusa credencial inválida', async () => {
    const repository = {
      findActiveByCredentials: async () => null,
    } as unknown as LoginRepository;

    await expect(
      new AuthenticateCredentialsUseCase(repository).call(
        'ana@example.com',
        'errada',
      ),
    ).rejects.toThrow('Senha de login inválida!');
  });
});
