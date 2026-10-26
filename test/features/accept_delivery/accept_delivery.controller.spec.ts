import request from 'supertest';
import { AcceptDeliveryModule } from '../../../src/features/accept_delivery/accept_delivery.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('AcceptDeliveryController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(AcceptDeliveryModule);
  });

  afterAll(() => ctx.close());

  it('atribui o motorista e avisa o cliente', async () => {
    ctx.db.users.push(activeUser({ userId: 8, userType: 2 }));
    ctx.db.users.push(activeUser({ userId: 7, deviceToken: 'cliente' }));
    ctx.db.orders.push(blankOrder({ id: 4, orderId: '4', userId: 7, driverId: 0 }));

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/acceptDeliveryRequest')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ order_id: '4' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true });
    expect(ctx.db.orders[0]).toEqual(
      expect.objectContaining({
        driverId: 8,
        deliveryStatus: DeliveryStatus.Accepted,
      }),
    );
    expect(ctx.db.notifications[0]).toEqual(
      expect.objectContaining({ toUserId: 7, type: 'accept' }),
    );
    expect(ctx.pushes[0]?.token).toBe('cliente');
  });

  it('recusa pedido que já tem motorista', async () => {
    ctx.db.orders[0] = blankOrder({ id: 4, orderId: '4', driverId: 3 });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/acceptDeliveryRequest')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ order_id: '4' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Não aceito !');
  });
});
