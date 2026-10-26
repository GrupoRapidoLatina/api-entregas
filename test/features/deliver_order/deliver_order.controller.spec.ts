import request from 'supertest';
import { DeliverOrderModule } from '../../../src/features/deliver_order/deliver_order.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('DeliverOrderController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(DeliverOrderModule);
  });

  afterAll(() => ctx.close());

  it('marca o pedido como entregue e avisa o cliente', async () => {
    ctx.db.users.push(
      activeUser({
        userId: 8,
        userType: 2,
        firstname: 'João',
        lastname: 'Souza',
        profileImage: 'joao.jpg',
      }),
    );
    ctx.db.reviews.push({ driverId: 8, driverRatting: '4' });
    ctx.db.reviews.push({ driverId: 8, driverRatting: '5' });
    ctx.db.users.push(activeUser({ userId: 7, deviceToken: 'cliente' }));
    ctx.db.orders.push(
      blankOrder({
        id: 4,
        orderId: '4',
        userId: 7,
        driverId: 8,
        idOperacao: 3,
      }),
    );
    ctx.db.statuses.push({
      codigo: '4',
      microStatus: 'ENTREGUE',
      ativo: 'S',
    });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/deliverOrder')
      .set('Authorization', ctx.bearer(8, 2))
      .send({
        id: 4,
        status_entregue: 'ENTREGUE',
        signature_name: 'Ana',
        latitude_foto: '-23.5',
        longitude_foto: '-46.6',
      });

    expect(response.status).toBe(201);
    expect(ctx.db.orders[0]?.deliveryStatus).toBe(DeliveryStatus.Delivered);
    expect(ctx.db.orders[0]?.signatureName).toBe('Ana');
    expect(ctx.db.historicos[0]).toEqual(
      expect.objectContaining({ idEntrega: 4, idStatus: '4' }),
    );
    expect(ctx.pushes[0]?.token).toBe('cliente');
    expect(ctx.pushes[0]?.message).toContain('João Souza');
    expect(ctx.pushes[0]?.message).toContain('Nota: 4.5');
    expect(ctx.pushes[0]?.extra?.driver_name).toBe('João Souza');
    expect(String(ctx.pushes[0]?.extra?.driver_image)).toContain('joao.jpg');
    expect(ctx.pushes[0]?.extra?.driver_rating).toBe('4.5');
  });

  it('recusa status de entrega inexistente', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/deliverOrder')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ id: 4, status_entregue: 'SUMIU' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('não existe na tabela status');
  });
});
