import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { FileUploadService } from '../../../core/services/file-upload/file-upload.service';

@Injectable()
export class UploadReportImageUseCase {
  constructor(private readonly fileUpload: FileUploadService) {}

  async call(input: {
    orderId: number;
    nfNumero?: string | null;
    file?: Express.Multer.File;
    fallbackPath?: string | null;
  }): Promise<string> {
    const file = input.file;
    if (!file?.buffer?.length) {
      return input.fallbackPath?.trim() || '';
    }

    try {
      return await this.fileUpload.uploadComprovante({
        imageBuffer: file.buffer,
        orderId: input.orderId,
        nfNumero: input.nfNumero,
        mimeType: file.mimetype,
        originalFileName: file.originalname,
      });
    } catch {
      throw new BadGatewayException(
        'Falha ao enviar a foto. Tente novamente.',
      );
    }
  }
}
