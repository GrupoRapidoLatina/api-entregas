import { NotificationsUseCase } from '../../../../src/features/notifications/use-cases/notifications.use-case';
import type { NotificationsRepository } from '../../../../src/features/notifications/repositories/notifications.repository';

describe('NotificationsUseCase', () => {
  const previous = process.env.IMAGE_BASE_URL;

  afterEach(() => {
    if (previous === undefined) delete process.env.IMAGE_BASE_URL;
    else process.env.IMAGE_BASE_URL = previous;
  });

  it('mapeia a mensagem e a foto do remetente', async () => {
    process.env.IMAGE_BASE_URL = 'https://cdn.test/';
    const repository = {
      findByUserId: async () => [
        {
          notification_id: 91,
          notification_type: 'accept',
          user_id: 7,
          notification_message: 'Pedido aceito',
          profile_image: 'ana.jpg',
          order_id: '4',
          delivery_status: 2,
          firstname: 'João',
          lastname: 'Lima',
        },
      ],
    } as unknown as NotificationsRepository;

    const response = await new NotificationsUseCase(repository).call(7);

    expect(response.data).toEqual([
      expect.objectContaining({
        notification_id: 91,
        type: 'accept',
        user_id: 7,
        message: 'Pedido aceito',
        profile_image: 'https://cdn.test/ana.jpg',
        order_id: '4',
      }),
    ]);
  });

  it('devolve lista vazia sem notificações', async () => {
    const repository = {
      findByUserId: async () => [],
    } as unknown as NotificationsRepository;

    await expect(new NotificationsUseCase(repository).call(7)).resolves.toEqual({
      success: true,
      data: [],
    });
  });
});
