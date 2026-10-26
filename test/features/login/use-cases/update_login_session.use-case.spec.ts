import { DeviceType } from '@prisma/client';
import { UpdateLoginSessionUseCase } from '../../../../src/features/login/use-cases/update_login_session.use-case';
import type { LoginRepository } from '../../../../src/features/login/repositories/login.repository';

describe('UpdateLoginSessionUseCase', () => {
  it('grava token, dispositivo e coordenadas da sessão', async () => {
    const calls: unknown[] = [];
    const repository = {
      updateSession: async (userId: number, data: unknown) => {
        calls.push({ userId, data });
      },
    } as unknown as LoginRepository;
    const session = {
      deviceToken: 'tok',
      deviceType: DeviceType.android,
      latitude: '-23.5',
      longitude: '-46.6',
      loginStatus: 'yes',
    };

    await new UpdateLoginSessionUseCase(repository).call(7, session);
    expect(calls).toEqual([{ userId: 7, data: session }]);
  });
});
