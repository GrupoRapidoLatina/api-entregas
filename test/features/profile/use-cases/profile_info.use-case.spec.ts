import { ProfileInfoUseCase } from '../../../../src/features/profile/use-cases/profile_info.use-case';
import type { ProfileRepository } from '../../../../src/features/profile/repositories/profile.repository';

describe('ProfileInfoUseCase', () => {
  const previous = process.env.IMAGE_BASE_URL;

  afterEach(() => {
    if (previous === undefined) delete process.env.IMAGE_BASE_URL;
    else process.env.IMAGE_BASE_URL = previous;
  });

  it('devolve o perfil com as fotos prefixadas', async () => {
    process.env.IMAGE_BASE_URL = 'https://cdn.test/';
    const repository = {
      findById: async () => ({
        userId: 7,
        firstname: 'Ana',
        lastname: 'Souza',
        email: 'ana@example.com',
        phone: '+5511999999999',
        profileImage: 'ana.jpg',
        licenceImageFront: null,
        licenceImageBack: null,
      }),
    } as unknown as ProfileRepository;

    const response = await new ProfileInfoUseCase(repository).call(7);
    expect(response.data).toEqual(
      expect.objectContaining({
        user_id: 7,
        firstname: 'Ana',
        profile_image: 'https://cdn.test/ana.jpg',
        licence_image_front: '',
      }),
    );
  });

  it('recusa usuário inexistente', async () => {
    const repository = {
      findById: async () => null,
    } as unknown as ProfileRepository;

    await expect(new ProfileInfoUseCase(repository).call(9)).rejects.toThrow(
      'Please enter valid user id !',
    );
  });
});
