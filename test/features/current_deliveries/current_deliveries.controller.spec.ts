import request from 'supertest';
import { CurrentDeliveriesModule } from '../../../src/features/current_deliveries/current_deliveries.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('CurrentDeliveriesController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(CurrentDeliveriesModule);
  });

  afterAll(() => ctx.close());

  it('lista entregas atuais do cliente e do motorista', async () => {
    ctx.db.users.push(activeUser());
    ctx.db.orders.push(
      blankOrder({
        id: 1,
        orderId: '1',
        userId: 7,
        deliveryStatus: DeliveryStatus.Available,
      }),
      blankOrder({
        id: 2,
        orderId: '2',
        driverId: 7,
        deliveryStatus: DeliveryStatus.Accepted,
      }),
    );

    const customer = await request(ctx.app.getHttpServer())
      .post('/ApiController/get_user_deliveries')
      .set('Authorization', ctx.bearer())
      .send({});
    const driver = await request(ctx.app.getHttpServer())
      .post('/ApiController/get_driver_deliveries')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(customer.status).toBe(201);
    expect(customer.body.data).toEqual([
      expect.objectContaining({ order_id: '1' }),
    ]);
    expect(driver.status).toBe(201);
    expect(driver.body.data).toEqual([
      expect.objectContaining({ order_id: '2' }),
    ]);
  });

  it('recusa sessão de usuário inativo', async () => {
    ctx.db.users.length = 0;

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/get_user_deliveries')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(response.status).toBe(401);
  });
});
