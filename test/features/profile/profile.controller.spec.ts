import request from 'supertest';
import { ProfileModule } from '../../../src/features/profile/profile.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('ProfileController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(ProfileModule);
  });

  afterAll(() => ctx.close());

  it('mostra e atualiza o perfil do usuário ativo', async () => {
    ctx.db.users.push(activeUser({ firstname: 'Ana' }));

    const info = await request(ctx.app.getHttpServer())
      .post('/ApiController/profileinfo')
      .set('Authorization', ctx.bearer())
      .send({});
    const edited = await request(ctx.app.getHttpServer())
      .post('/ApiController/editProfile')
      .set('Authorization', ctx.bearer())
      .send({ firstname: 'Ana Paula' });

    expect(info.status).toBe(201);
    expect(info.body.data.firstname).toBe('Ana');
    expect(edited.status).toBe(201);
    expect(edited.body.data.firstname).toBe('Ana Paula');
    expect(ctx.db.users[0]?.firstname).toBe('Ana Paula');
  });

  it('desativa a conta e recusa perfil inexistente', async () => {
    const removed = await request(ctx.app.getHttpServer())
      .post('/ApiController/deleteAccount')
      .set('Authorization', ctx.bearer())
      .send({});

    expect(removed.status).toBe(201);
    expect(ctx.db.users[0]?.userStatus).toBe(0);
    expect(ctx.db.users[0]?.loginStatus).toBe('no');

    const missing = await request(ctx.app.getHttpServer())
      .post('/ApiController/profileinfo')
      .set('Authorization', ctx.bearer())
      .send({});
    expect(missing.status).toBe(401);
  });
});
