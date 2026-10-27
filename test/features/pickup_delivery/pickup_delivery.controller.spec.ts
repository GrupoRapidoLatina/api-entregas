import request from 'supertest';
import { PickupDeliveryModule } from '../../../src/features/pickup_delivery/pickup_delivery.module';
import { DeliveryMicroStatus } from '../../../src/core/shared/enums/delivery-micro-status.enum';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('PickupDeliveryController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(PickupDeliveryModule);
  });

  afterAll(() => ctx.close());

  it('registra a coleta e avisa o cliente', async () => {
    ctx.db.users.push(activeUser({ userId: 8, userType: 2 }));
    ctx.db.users.push(activeUser({ userId: 7, deviceToken: 'cliente' }));
    ctx.db.orders.push(
      blankOrder({ id: 4, orderId: '4', userId: 7, driverId: 8, idOperacao: 3 }),
    );
    ctx.db.statuses.push({
      codigo: '2',
      microStatus: DeliveryMicroStatus.ColetaRealizada,
      ativo: 'S',
    });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/pickupdelivery')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ id: 4 });

    expect(response.status).toBe(201);
    expect(ctx.db.orders[0]?.deliveryStatus).toBe(DeliveryStatus.InProgress);
    expect(ctx.db.historicos[0]).toEqual(
      expect.objectContaining({ ocorrencia: 'COLETA REALIZADA' }),
    );
    expect(ctx.pushes[0]?.token).toBe('cliente');
  });

  it('recusa pedido inexistente', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/pickupdelivery')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ id: 99 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Pedido não encontrado');
  });
});
