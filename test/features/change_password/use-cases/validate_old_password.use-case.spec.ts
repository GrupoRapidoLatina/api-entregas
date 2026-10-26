import { ValidateOldPasswordUseCase } from '../../../../src/features/change_password/use-cases/validate_old_password.use-case';
import type { ChangePasswordRepository } from '../../../../src/features/change_password/repositories/change_password.repository';

describe('ValidateOldPasswordUseCase', () => {
  it('aceita a senha atual do usuário', async () => {
    const user = { userId: 7 };
    const repository = {
      findByIdAndPassword: async (userId: number, password: string) =>
        userId === 7 && password === 'antiga123' ? user : null,
    } as unknown as ChangePasswordRepository;

    await expect(
      new ValidateOldPasswordUseCase(repository).call(7, 'antiga123'),
    ).resolves.toBe(user);
  });

  it('recusa senha antiga inválida', async () => {
    const repository = {
      findByIdAndPassword: async () => null,
    } as unknown as ChangePasswordRepository;

    await expect(
      new ValidateOldPasswordUseCase(repository).call(7, 'errada'),
    ).rejects.toThrow('Senha antiga inválida!');
  });
});
