import request from 'supertest';
import { NearbyDeliveriesModule } from '../../../src/features/nearby_deliveries/nearby_deliveries.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('NearbyDeliveriesController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(NearbyDeliveriesModule);
  });

  afterAll(() => ctx.close());

  it('atualiza a posição e devolve entregas e motoristas próximos', async () => {
    ctx.db.users.push(activeUser({ userId: 8, userType: 2, vehicleType: 'motorbike' }));
    ctx.db.rawRows.push({ id: 4, distance: 1.2 });

    const nearby = await request(ctx.app.getHttpServer())
      .post('/ApiController/getNearByDeliveries')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ latitude: '-23.5', longitude: '-46.6' });
    const boys = await request(ctx.app.getHttpServer())
      .post('/ApiController/getNearByDeliveryBoys')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ latitude: '-23.5', longitude: '-46.6' });
    const moved = await request(ctx.app.getHttpServer())
      .post('/ApiController/updateLocation')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ latitude: '-23.6', longitude: '-46.7' });

    expect(nearby.status).toBe(201);
    expect(nearby.body.data.items).toEqual([{ id: 4, distance: 1.2 }]);
    expect(boys.status).toBe(201);
    expect(boys.body.data).toEqual([{ id: 4, distance: 1.2 }]);
    expect(moved.status).toBe(201);
    expect(ctx.db.users[0]).toEqual(
      expect.objectContaining({ latitude: '-23.6', longitude: '-46.7' }),
    );
  });

  it('recusa coordenada inválida', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/updateLocation')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ latitude: 'sul', longitude: '-46.6' });

    expect(response.status).toBe(400);
  });
});
