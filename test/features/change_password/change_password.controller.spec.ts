import request from 'supertest';
import { ChangePasswordModule } from '../../../src/features/change_password/change_password.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('ChangePasswordController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(ChangePasswordModule);
  });

  afterAll(() => ctx.close());

  it('troca a senha quando a antiga confere', async () => {
    ctx.db.users.push(activeUser({ password: 'antiga123' }));

    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/changePassword')
      .set('Authorization', ctx.bearer())
      .send({ old_password: 'antiga123', new_password: 'nova12345' });

    expect(response.status).toBe(201);
    expect(ctx.db.users[0]?.password).toBe('nova12345');
  });

  it('recusa senha antiga errada e senha nova curta', async () => {
    ctx.db.users[0] = activeUser({ password: 'antiga123' });

    const wrong = await request(ctx.app.getHttpServer())
      .post('/ApiController/changePassword')
      .set('Authorization', ctx.bearer())
      .send({ old_password: 'errada123', new_password: 'nova12345' });
    const short = await request(ctx.app.getHttpServer())
      .post('/ApiController/changePassword')
      .set('Authorization', ctx.bearer())
      .send({ old_password: 'antiga123', new_password: 'curta' });

    expect(wrong.status).toBe(401);
    expect(wrong.body.message).toBe('Senha antiga inválida!');
    expect(short.status).toBe(400);
    expect(ctx.db.users[0]?.password).toBe('antiga123');
  });
});
