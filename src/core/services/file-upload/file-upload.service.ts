import { Injectable, Logger } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  type ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import type { UploadComprovanteInput } from './models/upload-comprovante.input';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private client: S3Client | null = null;

  async uploadBuffer(
    buffer: Buffer,
    remoteFileName: string,
    contentType = 'application/octet-stream',
  ): Promise<string> {
    const key = remoteFileName.replace(/^\.?\/+/, '');
    return this.putObject(key, buffer, contentType);
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
    const remoteFileName = `uploads/user_${safeUserId}_${Date.now()}_${safeName}`;
    return this.uploadBuffer(
      file.buffer,
      remoteFileName,
      file.mimetype || 'application/octet-stream',
    );
  }

  async uploadComprovante({
    imageBuffer,
    orderId,
    nfNumero,
    mimeType,
    originalFileName,
  }: UploadComprovanteInput): Promise<string> {
    const fileExtension = this.extensionFor(mimeType, originalFileName);
    const safeNfNumero = this.safeNf(nfNumero);
    const objectKey = `comprovantes/${orderId}/${safeNfNumero}-${Date.now()}.${fileExtension}`;
    return this.putObject(
      objectKey,
      imageBuffer,
      mimeType || this.contentTypeFor(fileExtension),
    );
  }

  private async putObject(
    objectKey: string,
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const bucket = process.env.SPACES_BUCKET?.trim();
    if (!bucket) {
      throw new Error('SPACES_BUCKET é obrigatório para upload');
    }

    try {
      await this.resolveSpacesClient().send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: objectKey,
          Body: imageBuffer,
          ACL: 'public-read' as ObjectCannedACL,
          ContentType: mimeType,
        }),
      );
      return this.publicUrl(bucket, objectKey);
    } catch (err) {
      this.logger.error(`Falha no upload Spaces: ${String(err)}`);
      throw err;
    }
  }

  private resolveSpacesClient(): S3Client {
    if (this.client) return this.client;
    this.client = this.createSpacesClient();
    return this.client;
  }

  private createSpacesClient(): S3Client {
    const accessKeyId = process.env.SPACES_KEY?.trim();
    const secretAccessKey = process.env.SPACES_SECRET?.trim();
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('SPACES_KEY e SPACES_SECRET são obrigatórios para upload');
    }

    return new S3Client({
      endpoint: this.normalizeEndpoint(),
      region: process.env.SPACES_REGION?.trim() || 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: false,
    });
  }

  private normalizeEndpoint(): string {
    const raw = process.env.SPACES_ENDPOINT?.trim();
    if (!raw) {
      throw new Error('SPACES_ENDPOINT é obrigatório para upload');
    }

    const bucket = process.env.SPACES_BUCKET?.trim();
    const url = new URL(raw);
    if (bucket && url.hostname.startsWith(`${bucket}.`)) {
      url.hostname = url.hostname.slice(bucket.length + 1);
    }
    return url.origin;
  }

  private publicUrl(bucket: string, key: string): string {
    const endpoint = this.normalizeEndpoint();
    const host = new URL(endpoint).host;
    return `https://${bucket}.${host}/${key}`;
  }

  private safeNf(nfNumero?: string | null): string {
    const cleaned = String(nfNumero ?? '')
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    return cleaned || 'sem-nf';
  }

  private extensionFor(contentType?: string, originalName?: string): string {
    const fromName = originalName ? extname(originalName).replace('.', '') : '';
    if (fromName) return fromName.toLowerCase();
    switch (contentType) {
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/heic':
      case 'image/heif':
        return 'heic';
      default:
        return 'jpg';
    }
  }

  private contentTypeFor(ext: string): string {
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'heic':
      case 'heif':
        return 'image/heic';
      default:
        return 'image/jpeg';
    }
  }
}
