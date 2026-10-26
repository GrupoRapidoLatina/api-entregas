import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { ModuleMetadata, Type } from '@nestjs/common';
import { TokenService } from '../../src/core/auth/services/token.service';
import { SessionAuthModule } from '../../src/core/auth/session-auth.module';
import { PrismaService } from '../../src/core/database/prisma.service';
import { DatabaseModule } from '../../src/core/database/database.module';
import { HttpExceptionFilter } from '../../src/core/http/filters/http-exception.filter';
import { FcmService } from '../../src/core/services/fcm/fcm.service';
import { FileUploadService } from '../../src/core/services/file-upload/file-upload.service';
import { MailService } from '../../src/core/services/mail/mail.service';
import { InfraModule } from '../../src/core/services/service.module';
import { createMemoryPrisma, type MemoryDb } from './memory-prisma';

type PushCall = {
  token?: string | null;
  message: string;
  extra?: Record<string, string | number | null | undefined>;
};

type MailCall = {
  to: string;
  subject: string;
  html: string;
};

export type FeatureApp = {
  app: INestApplication;
  db: MemoryDb;
  pushes: PushCall[];
  mails: MailCall[];
  uploads: string[];
  bearer: (userId?: number, userType?: number | null) => string;
  close: () => Promise<void>;
};

export async function createFeatureApp(
  feature: NonNullable<ModuleMetadata['imports']>[number],
): Promise<FeatureApp> {
  const memory = createMemoryPrisma();
  const pushes: PushCall[] = [];
  const mails: MailCall[] = [];
  const uploads: string[] = [];

  const fileUpload = {
    uploadBuffer: async (_buffer: Buffer, remoteFileName: string) => {
      uploads.push(remoteFileName);
      return remoteFileName;
    },
    uploadMulterFile: async (
      file?: { buffer?: Buffer; originalname?: string },
      fallbackName = '',
      userId?: string,
    ) => {
      if (!file?.buffer?.length) return fallbackName;
      const name = `user_${userId}_${file.originalname ?? 'arquivo'}`;
      uploads.push(name);
      return name;
    },
  };

  const fcm = {
    push: async (
      token: string | null | undefined,
      message: string,
      extra?: Record<string, string | number | null | undefined>,
    ) => {
      pushes.push({ token, message, extra });
    },
  };

  const mail = {
    isConfigured: () => true,
    sendHtml: async (params: MailCall) => {
      mails.push(params);
      return true;
    },
  };

  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
      DatabaseModule,
      SessionAuthModule,
      InfraModule,
      feature as Type,
    ],
  })
    .overrideProvider(PrismaService)
    .useValue(memory.client)
    .overrideProvider(FileUploadService)
    .useValue(fileUpload)
    .overrideProvider(FcmService)
    .useValue(fcm)
    .overrideProvider(MailService)
    .useValue(mail)
    .compile();

  const app = moduleRef.createNestApplication({ logger: false });
  app.setGlobalPrefix('ApiController');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  const tokens = app.get(TokenService);
  return {
    app,
    db: memory.db,
    pushes,
    mails,
    uploads,
    bearer: (userId = 7, userType: number | null = 1) =>
      `Bearer ${tokens.sign(userId, userType)}`,
    close: async () => {
      await app.close();
    },
  };
}
