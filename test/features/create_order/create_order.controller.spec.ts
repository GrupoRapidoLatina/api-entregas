import request from 'supertest';
import { CreateOrderModule } from '../../../src/features/create_order/create_order.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('CreateOrderController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(CreateOrderModule);
  });

  afterAll(() => ctx.close());

  it('grava o preço calculado e ignora o delivery_cost do cliente', async () => {
    ctx.db.users.push(activeUser());
    ctx.db.settings.push({
      m2hour: '25',
      m4hour: '5',
      pDMinCharge: '10',
    });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/create_order')
      .set('Authorization', ctx.bearer())
      .send({
        pickupaddress: 'Rua A',
        dropoffaddress: 'Rua B',
        vehicle_type: 'motorbike',
        delivery_type: '4HOUR',
        delivery_cost: '0.01',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.order_id).toBe('1');
    expect(ctx.db.orders[0]?.deliveryCost).toBe('25.00');
    expect(ctx.db.orders[0]?.deliveryCost).not.toBe('0.01');
    expect(ctx.uploads[0]).toContain('label_1.pdf');
  });

  it('recusa criar pedido sem preço configurado', async () => {
    ctx.db.settings.length = 0;

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/create_order')
      .set('Authorization', ctx.bearer())
      .send({ vehicle_type: 'motorbike', delivery_type: '2HOUR' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Preço da corrida não configurado');
  });

  it('remarca o pedido encontrado e recusa pedido ausente', async () => {
    ctx.db.orders.push(blankOrder({ id: 4, orderId: '4' }));

    const ok = await request(ctx.app.getHttpServer())
      .post('/ApiController/rescheduleOrder')
      .set('Authorization', ctx.bearer())
      .send({
        order_id: '4',
        delivery_date: '2026-10-01',
        delivery_time: '14:00',
      });
    const missing = await request(ctx.app.getHttpServer())
      .post('/ApiController/rescheduleOrder')
      .set('Authorization', ctx.bearer())
      .send({ order_id: '99' });

    expect(ok.status).toBe(201);
    expect(ctx.db.orders.find((order) => order.orderId === '4')?.deliveryTime).toBe(
      '14:00',
    );
    expect(missing.status).toBe(404);
    expect(missing.body.message).toBe('Pedido não encontrado');
  });
});
