import { UpdateProfileUseCase } from '../../../../src/features/profile/use-cases/update_profile.use-case';
import type { ProfileRepository } from '../../../../src/features/profile/repositories/profile.repository';
import { UserType } from '../../../../src/core/shared/enums/user-type.enum';

function repositoryFor(current: Record<string, unknown> | null) {
  const updates: unknown[] = [];
  const repository = {
    findByEmail: async (email: string) =>
      email === 'ocupado@example.com' ? { userId: 99 } : null,
    findById: async () => current,
    updateProfile: async (_userId: number, data: unknown) => {
      updates.push(data);
      return data;
    },
  } as unknown as ProfileRepository;
  return { repository, updates };
}

describe('UpdateProfileUseCase', () => {
  it('atualiza o cliente quando o e-mail continua livre', async () => {
    const { repository, updates } = repositoryFor({
      userId: 7,
      userType: UserType.Customer,
      vehicleType: null,
      vehicleRegNo: null,
    });

    await new UpdateProfileUseCase(repository).call(7, {
      firstname: 'Ana',
      email: 'ana@example.com',
    });

    expect(updates).toEqual([{ firstname: 'Ana', email: 'ana@example.com' }]);
  });

  it('recusa e-mail de outro usuário, cadastro ausente ou placa inválida', async () => {
    await expect(
      new UpdateProfileUseCase(
        repositoryFor({ userId: 7, userType: UserType.Customer }).repository,
      ).call(7, { email: 'ocupado@example.com' }),
    ).rejects.toThrow('E-mail inválido !');

    await expect(
      new UpdateProfileUseCase(repositoryFor(null).repository).call(7, {
        firstname: 'Ana',
      }),
    ).rejects.toThrow('Usuário não encontrado');

    await expect(
      new UpdateProfileUseCase(
        repositoryFor({
          userId: 8,
          userType: UserType.Driver,
          vehicleType: 'motorbike',
          vehicleRegNo: 'ABC1D23',
        }).repository,
      ).call(8, { vehicleRegNo: 'XXX' }),
    ).rejects.toThrow('Placa inválida');

    await expect(
      new UpdateProfileUseCase(
        repositoryFor({
          userId: 8,
          userType: UserType.Driver,
          vehicleType: 'motorbike',
          vehicleRegNo: 'ABC1D23',
        }).repository,
      ).call(8, { vehicleType: 'car' }),
    ).rejects.toThrow('Ao trocar o veículo, informe a placa nova');
  });
});
