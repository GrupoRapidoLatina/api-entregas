import request from 'supertest';
import { SettingsPricesModule } from '../../../src/features/settings_prices/settings_prices.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';

describe('SettingsPricesController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(SettingsPricesModule);
  });

  afterAll(() => ctx.close());

  it('devolve o preço da coluna do veículo e do prazo', async () => {
    ctx.db.settings.push({
      m2hour: '20',
      m4hour: '30',
      pDMinCharge: '10',
      driverPercentage: '15',
    });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/getSettings')
      .set('Authorization', ctx.bearer())
      .send({ vehicle_type: 'moto', delivery_type: '4HOUR' });

    expect(response.status).toBe(201);
    expect(response.body.data.price).toBe('30.00');
    expect(response.body.data.vehicle).toEqual({
      currency: 'BRL',
      admin_percentage: '15',
    });
  });

  it('recusa quando não há tabela de preços', async () => {
    ctx.db.settings.length = 0;

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/getSettings')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Sem dados disponíveis !');
  });
});
