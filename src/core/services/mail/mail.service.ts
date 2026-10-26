import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  isConfigured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
  }

  async sendHtml(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `SMTP não configurado — e-mail não enviado para ${params.to}`,
      );
      return false;
    }

    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER
          ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD || '',
          }
          : undefined,
    });

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM_NAME
          ? `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`
          : process.env.SMTP_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return true;
  }
}
