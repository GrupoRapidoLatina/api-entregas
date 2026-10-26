import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  async uploadBuffer(
    buffer: Buffer,
    remoteFileName: string,
  ): Promise<string> {
    const host = process.env.FTP_HOST;
    if (!host) {
      throw new Error('FTP_HOST é obrigatório para upload');
    }

    const client = new Client();
    try {
      await client.access({
        host,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        secure: process.env.FTP_SECURE === 'true',
      });
      const remoteDir = process.env.FTP_REMOTE_DIR || './image/';
      await client.ensureDir(remoteDir);
      await client.uploadFrom(Readable.from(buffer), remoteFileName);
      return remoteFileName;
    } catch (err) {
      this.logger.error(`Falha no upload remoto: ${String(err)}`);
      throw err;
    } finally {
      client.close();
    }
  }

  async uploadMulterFile(
    file?: Express.Multer.File,
    fallbackName = '',
    userId?: string,
  ): Promise<string> {
    if (!file?.buffer?.length) return fallbackName;
    const safeUserId = String(userId ?? '').replace(/[^a-zA-Z0-9@._-]/g, '');
    if (!safeUserId) {
      throw new Error('user_id é obrigatório para upload');
    }
    const safeName = `${file.originalname}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const remoteFileName = `user_${safeUserId}_${Date.now()}_${safeName}`;
    return this.uploadBuffer(file.buffer, remoteFileName);
  }
}
