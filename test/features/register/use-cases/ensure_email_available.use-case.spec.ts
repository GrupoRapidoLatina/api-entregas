import { EnsureEmailAvailableUseCase } from '../../../../src/features/register/use-cases/ensure_email_available.use-case';
import type { RegisterRepository } from '../../../../src/features/register/repositories/register.repository';

describe('EnsureEmailAvailableUseCase', () => {
  it('segue quando o e-mail ainda não existe', async () => {
    const repository = {
      findByEmail: async () => null,
    } as unknown as RegisterRepository;

    await expect(
      new EnsureEmailAvailableUseCase(repository).call('novo@example.com'),
    ).resolves.toBeUndefined();
  });

  it('recusa e-mail já cadastrado', async () => {
    const repository = {
      findByEmail: async () => ({ userId: 1 }),
    } as unknown as RegisterRepository;

    await expect(
      new EnsureEmailAvailableUseCase(repository).call('ana@example.com'),
    ).rejects.toThrow('E-mail inválido !');
  });
});
