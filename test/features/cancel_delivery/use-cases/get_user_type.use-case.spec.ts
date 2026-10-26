import { GetUserTypeUseCase } from '../../../../src/features/cancel_delivery/use-cases/get_user_type.use-case';
import type { CancelDeliveryRepository } from '../../../../src/features/cancel_delivery/repositories/cancel_delivery.repository';
import { UserType } from '../../../../src/core/shared/enums/user-type.enum';

describe('GetUserTypeUseCase', () => {
  it('devolve o tipo do usuário', async () => {
    const repository = {
      findUser: async () => ({ userType: UserType.Customer }),
    } as unknown as CancelDeliveryRepository;

    await expect(new GetUserTypeUseCase(repository).call(7)).resolves.toBe(
      UserType.Customer,
    );
  });

  it('recusa usuário inexistente', async () => {
    const repository = {
      findUser: async () => null,
    } as unknown as CancelDeliveryRepository;

    await expect(new GetUserTypeUseCase(repository).call(9)).rejects.toThrow(
      'Usuário inválido',
    );
  });
});
