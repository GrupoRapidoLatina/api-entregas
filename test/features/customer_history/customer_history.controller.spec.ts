import request from 'supertest';
import { CustomerHistoryModule } from '../../../src/features/customer_history/customer_history.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('CustomerHistoryController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(CustomerHistoryModule);
  });

  afterAll(() => ctx.close());

  it('devolve o histórico do cliente', async () => {
    ctx.db.users.push(activeUser());
    ctx.db.orders.push(
      blankOrder({
        id: 3,
        orderId: '3',
        userId: 7,
        deliveryStatus: DeliveryStatus.Delivered,
      }),
    );

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/customerOrderHistory')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual([
      expect.objectContaining({ order_id: '3', delivery_status: 4 }),
    ]);
  });

  it('recusa sem usuário ativo', async () => {
    ctx.db.users.length = 0;
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/customerOrderHistory')
      .set('Authorization', ctx.bearer())
      .send({});
    expect(response.status).toBe(401);
  });
});
