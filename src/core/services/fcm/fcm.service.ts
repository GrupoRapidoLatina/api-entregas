import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import type { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private app: App | null = null;

  onModuleInit() {
    this.app = this.createApp();
    if (!this.app) {
      this.logger.warn(
        'FCM desligado — configure FCM_SERVICE_ACCOUNT_PATH (ou JSON) no .env. Ver docs/FCM.md',
      );
      return;
    }
    this.logger.log(
      `FCM pronto (projectId=${process.env.FCM_PROJECT_ID || 'default'})`,
    );
  }

  get isReady(): boolean {
    return this.app !== null;
  }

  private createApp(): App | null {
    if (getApps().length) return getApps()[0]!;

    const credential = this.resolveCredential();
    if (!credential) return null;

    const projectId = process.env.FCM_PROJECT_ID?.trim() || undefined;
    return initializeApp({
      credential,
      ...(projectId ? { projectId } : {}),
    });
  }

  private resolveCredential() {
    const fromJson = this.credentialFromInlineJson();
    if (fromJson) return fromJson;

    return this.credentialFromFilePath();
  }

  private credentialFromInlineJson() {
    const jsonInline = process.env.FCM_SERVICE_ACCOUNT_JSON?.trim();
    if (!jsonInline) return null;
    return cert(JSON.parse(jsonInline) as ServiceAccount);
  }

  private credentialFromFilePath() {
    const configuredPath =
      process.env.FCM_SERVICE_ACCOUNT_PATH?.trim() ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
    if (!configuredPath) return null;

    const absolute = resolve(configuredPath);
    if (!existsSync(absolute)) {
      this.logger.warn(
        `Arquivo de service account não encontrado: ${absolute}`,
      );
      return null;
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = absolute;
    const parsed = JSON.parse(readFileSync(absolute, 'utf8')) as ServiceAccount;
    return cert(parsed);
  }

  async push(
    deviceToken: string | null | undefined,
    message: string,
    extra?: Record<string, string | number | null | undefined>,
    imageUrl?: string,
  ) {
    if (!deviceToken) return;
    if (!this.app) {
      this.logger.debug(`FCM skip (não configurado): ${message}`);
      return;
    }

    try {
      await getMessaging(this.app).send({
        token: deviceToken,
        notification: {
          title: 'Rápido Entregas',
          body: message,
          ...(imageUrl ? { imageUrl } : {}),
        },
        data: this.toData(message, extra),
      });
    } catch (err) {
      this.logger.warn(`FCM falhou: ${String(err)}`);
    }
  }

  private toData(
    message: string,
    extra?: Record<string, string | number | null | undefined>,
  ) {
    const data: Record<string, string> = {
      body: message,
      title: 'Rápido Entregas',
    };
    if (!extra) return data;
    for (const [key, value] of Object.entries(extra)) {
      if (value === undefined || value === null || value === '') continue;
      data[key] = String(value);
    }
    return data;
  }
}
