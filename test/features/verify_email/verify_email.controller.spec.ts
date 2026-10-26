import request from 'supertest';
import { VerifyEmailModule } from '../../../src/features/verify_email/verify_email.module';
import { UserStatus } from '../../../src/core/shared/enums/user-status.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('VerifyEmailController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(VerifyEmailModule);
  });

  afterAll(() => ctx.close());

  it('ativa a conta pelo POST e pelo GET quando o código confere', async () => {
    ctx.db.users.push(
      activeUser({
        email: 'ana@example.com',
        verify: '1234',
        userStatus: UserStatus.PendingDriver,
      }),
    );

    const posted = await request(ctx.app.getHttpServer())
      .post('/ApiController/verifyemail')
      .send({ email: 'ana@example.com', code: '1234' });

    expect(posted.status).toBe(201);
    expect(posted.body.data).toEqual({
      email: 'ana@example.com',
      verified: true,
    });
    expect(ctx.db.users[0]?.userStatus).toBe(UserStatus.Active);

    ctx.db.users[0] = activeUser({
      email: 'ana@example.com',
      verify: '1234',
      userStatus: UserStatus.PendingDriver,
    });
    const gotten = await request(ctx.app.getHttpServer()).get(
      '/ApiController/verifyemail?email=ana@example.com&code=1234',
    );
    expect(gotten.status).toBe(200);
    expect(ctx.db.users[0]?.userStatus).toBe(UserStatus.Active);
  });

  it('recusa código diferente do cadastro', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/verifyemail')
      .send({ email: 'ana@example.com', code: '0000' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Código de verificação inválido');
  });
});
