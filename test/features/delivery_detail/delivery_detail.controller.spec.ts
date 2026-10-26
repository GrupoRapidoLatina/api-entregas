import request from 'supertest';
import { DeliveryDetailModule } from '../../../src/features/delivery_detail/delivery_detail.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { blankOrder } from '../../support/memory-prisma';

describe('DeliveryDetailController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(DeliveryDetailModule);
  });

  afterAll(() => ctx.close());

  it('devolve o detalhe pelo id da entrega', async () => {
    ctx.db.orders.push(
      blankOrder({
        id: 4,
        orderId: '4',
        deliveryCost: '20.00',
        deliveryDate: new Date('2026-09-30T15:00:00.000Z'),
        deliveryTime: '2026-09-30 14:00:00',
        parcelHeight: '1,50 cm',
        parcelWidth: '0,80 cm',
        parcelLenght: '0,40 cm',
        parcelWeight: '2,00 kg',
      }),
    );

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/deliveryDetail')
      .set('Authorization', ctx.bearer())
      .send({ id_entrega: '4' });

    expect(response.status).toBe(201);
    expect(response.body.data.deliverydata).toEqual(
      expect.objectContaining({
        id: 4,
        delivery_cost: '20.00',
        delivery_date: '2026-09-30',
        delivery_time: '14:00',
        parcel_height: '1,50 cm',
        parcel_width: '0,80 cm',
        parcel_lenght: '0,40 cm',
        parcel_weight: '2,00 kg',
      }),
    );
  });

  it('recusa pedido inexistente', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/deliveryDetail')
      .set('Authorization', ctx.bearer())
      .send({ order_id: 'sumiu' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Please enter valid user id !');
  });
});
