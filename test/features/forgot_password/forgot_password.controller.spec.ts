import request from 'supertest';
import { ForgotPasswordModule } from '../../../src/features/forgot_password/forgot_password.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('ForgotPasswordController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(ForgotPasswordModule);
  });

  afterAll(() => ctx.close());

  it('envia o link e redefine a senha com o token', async () => {
    ctx.db.users.push(activeUser({ email: 'ana@example.com', password: 'antiga123' }));

    const asked = await request(ctx.app.getHttpServer())
      .post('/ApiController/forgetPassword')
      .send({ email: 'ana@example.com' });

    expect(asked.status).toBe(201);
    expect(ctx.mails[0]?.subject).toBe('Recuperar Senha');
    const token = String(ctx.mails[0]?.html ?? '').match(/token=([^"&]+)/)?.[1];
    expect(token).toEqual(expect.any(String));

    const reset = await request(ctx.app.getHttpServer())
      .post('/ApiController/reset_password')
      .send({ token: decodeURIComponent(token ?? ''), password: 'nova12345' });

    expect(reset.status).toBe(201);
    expect(ctx.db.users[0]?.password).toBe('nova12345');
    expect(ctx.db.users[0]?.forgetTime).toBeNull();
  });

  it('recusa e-mail inexistente', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/forgetPassword')
      .send({ email: 'sumiu@example.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('E-mail não encontrado!');
  });
});
