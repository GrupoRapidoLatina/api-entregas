import request from 'supertest';
import { RegisterModule } from '../../../src/features/register/register.module';
import { UserStatus } from '../../../src/core/shared/enums/user-status.enum';
import { UserType } from '../../../src/core/shared/enums/user-type.enum';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';
import { activeUser } from '../../support/memory-prisma';

describe('RegisterController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(RegisterModule);
  });

  afterAll(() => ctx.close());

  it('cadastra cliente ativo e grava a imagem depois', async () => {
    const created = await request(ctx.app.getHttpServer())
      .post('/ApiController/registration')
      .send({
        email: 'novo@example.com',
        password: 'senha1234',
        firstname: 'Novo',
        phone: '+5511999999999',
        user_type: UserType.Customer,
      });

    expect(created.status).toBe(201);
    expect(created.body.data.email).toBe('novo@example.com');
    const user = ctx.db.users.find((row) => row.email === 'novo@example.com');
    expect(user?.userStatus).toBe(UserStatus.Active);
    expect(user?.password).toBe('senha1234');

    const images = await request(ctx.app.getHttpServer())
      .post('/ApiController/registrationImages')
      .send({ user_id: user?.userId, profile_image: 'novo.jpg' });

    expect(images.status).toBe(201);
    expect(user?.profileImage).toBe('novo.jpg');
  });

  it('recusa e-mail repetido e usuário inexistente na imagem', async () => {
    ctx.db.users.push(activeUser({ email: 'ana@example.com' }));

    const duplicate = await request(ctx.app.getHttpServer())
      .post('/ApiController/registration')
      .send({ email: 'ana@example.com', password: 'senha1234' });
    const missing = await request(ctx.app.getHttpServer())
      .post('/ApiController/registrationImages')
      .send({ user_id: 999, profile_image: 'x.jpg' });

    expect(duplicate.status).toBe(400);
    expect(duplicate.body.message).toBe('E-mail inválido !');
    expect(missing.status).toBe(400);
    expect(missing.body.message).toBe('Usuário não encontrado');
  });
});
