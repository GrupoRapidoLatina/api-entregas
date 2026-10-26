import request from 'supertest';
import { DriverHistoryModule } from '../../../src/features/driver_history/driver_history.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('DriverHistoryController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(DriverHistoryModule);
  });

  afterAll(() => ctx.close());

  it('devolve o histórico do motorista', async () => {
    ctx.db.users.push(activeUser({ userId: 8, userType: 2 }));
    ctx.db.orders.push(
      blankOrder({
        id: 6,
        orderId: '6',
        driverId: 8,
        deliveryStatus: DeliveryStatus.Legacy6,
      }),
    );

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/driverOrderHistory')
      .set('Authorization', ctx.bearer(8, 2))
      .send({});

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual([
      expect.objectContaining({ order_id: '6' }),
    ]);
  });

  it('recusa sem usuário ativo', async () => {
    ctx.db.users.length = 0;
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/driverOrderHistory')
      .set('Authorization', ctx.bearer(8, 2))
      .send({});
    expect(response.status).toBe(401);
  });
});
