import request from 'supertest';
import { ReportProblemModule } from '../../../src/features/report_problem/report_problem.module';
import { DeliveryStatus } from '../../../src/core/shared/enums/delivery-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser, blankOrder } from '../../support/memory-prisma';

describe('ReportProblemController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(ReportProblemModule);
  });

  afterAll(() => ctx.close());

  it('registra o problema e marca o pedido', async () => {
    ctx.db.users.push(activeUser({ userId: 8, userType: 2 }));
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
      codigo: '9',
      microStatus: 'AUSENTE',
      ativo: 'S',
    });

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/reportProblem')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ id: 4, message: 'AUSENTE', comment: 'portão fechado' });

    expect(response.status).toBe(201);
    expect(ctx.db.orders[0]?.deliveryStatus).toBe(DeliveryStatus.Legacy6);
    expect(ctx.db.reports[0]).toEqual(
      expect.objectContaining({ comment: 'portão fechado', message: 'AUSENTE' }),
    );
    expect(ctx.pushes[0]?.token).toBe('cliente');
  });

  it('recusa relato sem micro status e reabre o pedido do cliente', async () => {
    const missing = await request(ctx.app.getHttpServer())
      .post('/ApiController/reportProblem')
      .set('Authorization', ctx.bearer(8, 2))
      .send({ id: 4, comment: 'sem status' });

    ctx.db.users.push(activeUser({ userId: 7 }));
    ctx.db.orders.push(blankOrder({ id: 5, orderId: '5', userId: 7, driverId: 8 }));
    const reopened = await request(ctx.app.getHttpServer())
      .post('/ApiController/changeReportproblemstatus')
      .set('Authorization', ctx.bearer(7, 1))
      .send({ order_id: '5' });

    expect(missing.status).toBe(400);
    expect(missing.body.message).toBe('message (micro_status) é obrigatório');
    expect(reopened.status).toBe(201);
    expect(ctx.db.orders.find((order) => order.orderId === '5')).toEqual(
      expect.objectContaining({
        driverId: 0,
        deliveryStatus: DeliveryStatus.Available,
      }),
    );
  });
});
