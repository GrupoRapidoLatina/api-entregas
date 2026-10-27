import request from 'supertest';
import { CancelDeliveryModule } from '../../../src/features/cancel_delivery/cancel_delivery.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { UserType } from '../../../src/core/shared/enums/user-type.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('CancelDeliveryController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(CancelDeliveryModule);
  });

  afterAll(() => ctx.close());

  it('cancela como cliente e avisa o motorista', async () => {
    ctx.db.users.push(activeUser({ userId: 7, userType: UserType.Customer }));
    ctx.db.users.push(
      activeUser({ userId: 8, userType: UserType.Driver, deviceToken: 'moto' }),
    );
    ctx.db.orders.push(
      blankOrder({
        id: 4,
        orderId: '4',
        userId: 7,
        driverId: 8,
        deliveryStatus: DeliveryStatus.Accepted,
      }),
    );

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/cancelDelivery')
      .set('Authorization', ctx.bearer(7, UserType.Customer))
      .send({ order_id: '4' });

    expect(response.status).toBe(201);
    expect(ctx.db.orders[0]?.deliveryStatus).toBe(
      DeliveryStatus.PedidoCancelado,
    );
    expect(ctx.db.orders[0]?.driverId).toBe(0);
    expect(ctx.db.notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ toUserId: 7, type: 'cancel' }),
        expect.objectContaining({ toUserId: 8, type: 'cancel' }),
      ]),
    );
    expect(ctx.pushes).toHaveLength(1);
    expect(ctx.pushes[0]?.token).toBe('moto');
  });

  it('recusa usuário inexistente', async () => {
    ctx.db.users.length = 0;

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/cancelDelivery')
      .set('Authorization', ctx.bearer(7, 1))
      .send({ order_id: '4' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuário inválido ou inativo!');
  });
});
