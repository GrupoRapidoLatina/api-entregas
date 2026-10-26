import request from 'supertest';
import { ReviewModule } from '../../../src/features/review/review.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('ReviewController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(ReviewModule);
  });

  afterAll(() => ctx.close());

  it('grava a avaliação do pedido', async () => {
    ctx.db.users.push(activeUser());

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/review')
      .set('Authorization', ctx.bearer())
      .send({
        order_id: 4,
        customer_id: 7,
        driver_id: 8,
        driverRatting: 5,
        feedback: 'ótima',
      });

    expect(response.status).toBe(201);
    expect(ctx.db.reviews[0]).toEqual(
      expect.objectContaining({
        orderId: 4,
        driverRatting: '5',
        feedback: 'ótima',
        id: 1,
      }),
    );
  });

  it('recusa pedido sem order_id', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/review')
      .set('Authorization', ctx.bearer())
      .send({ feedback: 'sem pedido' });

    expect(response.status).toBe(400);
  });
});
