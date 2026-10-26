import request from 'supertest';
import { PartnersModule } from '../../../src/features/partners/partners.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';

describe('PartnersController', () => {
  const previous = process.env.APP_VERSION;
  let ctx: FeatureApp;

  beforeAll(async () => {
    process.env.APP_VERSION = '2.4.0';
    ctx = await createFeatureApp(PartnersModule);
  });

  afterAll(async () => {
    if (previous === undefined) delete process.env.APP_VERSION;
    else process.env.APP_VERSION = previous;
    await ctx.close();
  });

  it('informa a versão do app', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/versaoAtual')
      .send({});

    expect(response.status).toBe(201);
    expect(response.body.data).toBe('2.4.0');
  });

  it('localiza o parceiro pelo CNPJ e recusa CNPJ desconhecido', async () => {
    ctx.db.operacoes.push({
      codigo: 9,
      razao: 'Parceiro Atual',
      cgc: '12345678000190',
      ativo: 'S',
    });

    const found = await request(ctx.app.getHttpServer())
      .post('/ApiController/locParceiro')
      .send({ cnpj: '12.345.678/0001-90' });
    const missing = await request(ctx.app.getHttpServer())
      .post('/ApiController/locParceiro')
      .send({ cnpj: '00000000000000' });

    expect(found.status).toBe(201);
    expect(found.body.data).toEqual([
      { codigo: 9, razao: 'Parceiro Atual', cgc: '12345678000190' },
    ]);
    expect(missing.status).toBe(404);
    expect(missing.body.message).toBe('Parceiro não encontrado');
  });
});
