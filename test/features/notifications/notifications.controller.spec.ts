import request from 'supertest';
import { NotificationsModule } from '../../../src/features/notifications/notifications.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('NotificationsController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(NotificationsModule);
  });

  afterAll(() => ctx.close());

  it('devolve as notificações do usuário', async () => {
    ctx.db.users.push(activeUser());
    ctx.db.rawRows.push({
      user_id: 7,
      notification_message: 'Pedido aceito',
      profile_image: 'ana.jpg',
      order_id: '4',
      firstname: 'João',
      lastname: 'Lima',
    });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/notifications')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(response.status).toBe(201);
    expect(response.body.data[0]).toEqual(
      expect.objectContaining({
        message: 'Pedido aceito',
        profile_image: expect.stringContaining('ana.jpg'),
      }),
    );
  });

  it('recusa sem usuário ativo', async () => {
    ctx.db.users.length = 0;
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/notifications')
      .set('Authorization', ctx.bearer())
      .send({});
    expect(response.status).toBe(401);
  });
});
