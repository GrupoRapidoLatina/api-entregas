import { DeleteAccountUseCase } from '../../../../src/features/profile/use-cases/delete_account.use-case';
import type { ProfileRepository } from '../../../../src/features/profile/repositories/profile.repository';

describe('DeleteAccountUseCase', () => {
  it('desativa a conta do usuário', async () => {
    const calls: number[] = [];
    const repository = {
      deactivateAccount: async (userId: number) => {
        calls.push(userId);
      },
    } as unknown as ProfileRepository;

    await new DeleteAccountUseCase(repository).call(7);
    expect(calls).toEqual([7]);
  });
});
