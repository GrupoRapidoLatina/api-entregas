import { SendPasswordResetEmailUseCase } from '../../../../src/features/forgot_password/use-cases/send_password_reset_email.use-case';
import type { MailService } from '../../../../src/core/services/mail/mail.service';

describe('SendPasswordResetEmailUseCase', () => {
  const previousEnv = process.env.APP_ENV;

  afterEach(() => {
    if (previousEnv === undefined) delete process.env.APP_ENV;
    else process.env.APP_ENV = previousEnv;
  });

  it('envia o HTML de recuperação para o e-mail informado', async () => {
    const sent: Array<{ to: string; subject: string; html: string }> = [];
    const mail = {
      sendHtml: async (params: { to: string; subject: string; html: string }) => {
        sent.push(params);
        return true;
      },
    } as unknown as MailService;

    await expect(
      new SendPasswordResetEmailUseCase(mail).call({
        email: 'ana@example.com',
        firstname: 'Ana',
        resetUrl: 'rapidoentregas://reset-password?token=abc',
      }),
    ).resolves.toBe(true);
    expect(sent[0]).toEqual(
      expect.objectContaining({
        to: 'ana@example.com',
        subject: 'Recuperar Senha',
      }),
    );
    expect(sent[0]?.html).toContain('Ana');
  });

  it('recusa em produção quando o e-mail não sai', async () => {
    process.env.APP_ENV = 'prod';
    const mail = {
      sendHtml: async () => false,
    } as unknown as MailService;

    await expect(
      new SendPasswordResetEmailUseCase(mail).call({
        email: 'ana@example.com',
        firstname: 'Ana',
        resetUrl: 'https://app/reset',
      }),
    ).rejects.toThrow('Serviço de e-mail indisponível');
  });
});
