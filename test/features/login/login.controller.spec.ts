import request from 'supertest';
import { LoginModule } from '../../../src/features/login/login.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('LoginController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(LoginModule);
  });

  afterAll(() => ctx.close());

  it('autentica, abre sessão e devolve o token', async () => {
    ctx.db.users.push(activeUser({ password: 'senha1234', loginStatus: 'no' }));

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/login')
      .send({
        email: 'ana@example.com',
        password: 'senha1234',
        device_token: 'aparelho',
        device_type: 'android',
        latitude: '-23.5',
        longitude: '-46.6',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user_id).toBe(7);
    expect(response.body.data.token).toEqual(expect.any(String));
    expect(ctx.db.users[0]).toEqual(
      expect.objectContaining({
        loginStatus: 'yes',
        deviceToken: 'aparelho',
        latitude: '-23.5',
      }),
    );
  });

  it('recusa senha inválida e encerra a sessão no logout', async () => {
    const denied = await request(ctx.app.getHttpServer())
      .post('/ApiController/login')
      .send({ email: 'ana@example.com', password: 'errada123' });

    const logout = await request(ctx.app.getHttpServer())
      .post('/ApiController/logout')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(denied.status).toBe(401);
    expect(denied.body.message).toBe('Senha de login inválida!');
    expect(logout.status).toBe(201);
    expect(ctx.db.users[0]?.loginStatus).toBe('no');
    expect(ctx.db.users[0]?.deviceToken).toBe('');
  });
});
