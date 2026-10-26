import { UpdatePasswordUseCase } from '../../../../src/features/change_password/use-cases/update_password.use-case';
import type { ChangePasswordRepository } from '../../../../src/features/change_password/repositories/change_password.repository';

describe('UpdatePasswordUseCase', () => {
  it('grava a senha nova do usuário', async () => {
    const calls: Array<{ userId: number; password: string }> = [];
    const repository = {
      updatePassword: async (userId: number, password: string) => {
        calls.push({ userId, password });
      },
    } as unknown as ChangePasswordRepository;

    await new UpdatePasswordUseCase(repository).call(7, 'nova12345');
    expect(calls).toEqual([{ userId: 7, password: 'nova12345' }]);
  });
});
