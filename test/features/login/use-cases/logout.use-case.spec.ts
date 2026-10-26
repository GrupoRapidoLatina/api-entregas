import { LogoutUseCase } from '../../../../src/features/login/use-cases/logout.use-case';
import type { LoginRepository } from '../../../../src/features/login/repositories/login.repository';

describe('LogoutUseCase', () => {
  it('encerra a sessão e confirma sucesso', async () => {
    const calls: number[] = [];
    const repository = {
      clearSession: async (userId: number) => {
        calls.push(userId);
      },
    } as unknown as LoginRepository;

    await expect(new LogoutUseCase(repository).call(7)).resolves.toEqual({
      success: true,
    });
    expect(calls).toEqual([7]);
  });
});
