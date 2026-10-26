import request from 'supertest';
import { UploadModule } from '../../../src/features/upload/upload.module';
import { createFeatureApp, type FeatureApp } from '../../support/feature-app';

describe('UploadController', () => {
  let ctx: FeatureApp;

  beforeAll(async () => {
    ctx = await createFeatureApp(UploadModule);
  });

  afterAll(() => ctx.close());

  it('devolve o nome remoto do arquivo enviado', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/upload')
      .field('user_id', '7')
      .attach('file', Buffer.from('foto'), 'foto.jpg');

    expect(response.status).toBe(201);
    expect(response.body.data.filename).toBe('user_7_foto.jpg');
    expect(response.body.data.url).toContain('user_7_foto.jpg');
    expect(ctx.uploads).toContain('user_7_foto.jpg');
  });

  it('recusa upload sem arquivo', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/ApiController/upload')
      .field('user_id', '7');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Arquivo é obrigatório');
  });
});
