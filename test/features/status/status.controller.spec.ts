import request from 'supertest';
import { StatusModule } from '../../../src/features/status/status.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('StatusController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(StatusModule);
  });

  afterAll(() => ctx.close());

  it('lista status ativos e só os de problema quando pedido', async () => {
    ctx.db.users.push(activeUser());
    ctx.db.statuses.push(
      {
        codigo: '2',
        macroStatus: 'ENTREGA',
        microStatus: 'COLETA REALIZADA',
        ativo: 'S',
        finalizador: 'N',
      },
      {
        codigo: '9',
        macroStatus: 'FALHA NA ENTREGA',
        microStatus: 'AUSENTE',
        ativo: 'S',
        finalizador: 'S',
      },
    );

    const all = await request(ctx.app.getHttpServer())
      .post('/ApiController/status')
      .set('Authorization', ctx.bearer())
      .send({});
    const problems = await request(ctx.app.getHttpServer())
      .post('/ApiController/status')
      .set('Authorization', ctx.bearer())
      .send({ tipo: 'problema' });

    expect(all.status).toBe(201);
    expect(all.body.data).toHaveLength(2);
    expect(problems.body.data).toEqual([
      expect.objectContaining({ micro_status: 'AUSENTE' }),
    ]);
  });

  it('recusa quando não há status', async () => {
    ctx.db.statuses.length = 0;
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/status')
      .set('Authorization', ctx.bearer())
      .send({});
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Nenhum status disponível');
  });
});
