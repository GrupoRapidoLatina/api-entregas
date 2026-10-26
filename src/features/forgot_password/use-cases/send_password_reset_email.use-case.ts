import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MailService } from '../../../core/services/mail/mail.service';
import { resetPasswordEmailHtml } from '../views/reset-password-email.view';

@Injectable()
export class SendPasswordResetEmailUseCase {
  private readonly logger = new Logger(SendPasswordResetEmailUseCase.name);

  constructor(private readonly mail: MailService) { }

  async call(params: {
    email: string;
    firstname: string;
    resetUrl: string;
  }) {
    const html = resetPasswordEmailHtml({
      firstname: params.firstname,
      email: params.email,
      resetUrl: params.resetUrl,
    });

    const sent = await this.mail.sendHtml({
      to: params.email,
      subject: 'Recuperar Senha',
      html,
    });

    if (!sent) {
      this.logger.warn(`Link de reset (SMTP off): ${params.resetUrl}`);
      if ((process.env.APP_ENV || '').toLowerCase() === 'prod') {
        throw new ServiceUnavailableException(
          'Serviço de e-mail indisponível. Tente mais tarde.',
        );
      }
    }

    return sent;
  }
}
