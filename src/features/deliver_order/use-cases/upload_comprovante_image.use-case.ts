import {
  BadGatewayException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { imageUrl } from '../../../core/helpers/image-url.helper';
import { FileUploadService } from '../../../core/services/file-upload/file-upload.service';

@Injectable()
export class UploadComprovanteImageUseCase {
  private readonly logger = new Logger(UploadComprovanteImageUseCase.name);

  constructor(private readonly fileUpload: FileUploadService) {}

  async call(input: {
    orderId: number;
    nfNumero?: string | null;
    file?: Express.Multer.File;
    receivedUserImage?: string | null;
    validacaoId?: string | null;
  }): Promise<string | null> {
    const file = input.file;
    if (file?.buffer?.length) {
      return this.uploadFile(input, file);
    }

    const legacy = input.receivedUserImage?.trim() || '';
    if (!legacy) return null;
    return imageUrl(legacy) || legacy;
  }

  private async uploadFile(
    input: {
      orderId: number;
      nfNumero?: string | null;
      validacaoId?: string | null;
    },
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const url = await this.fileUpload.uploadComprovante({
        imageBuffer: file.buffer,
        orderId: input.orderId,
        nfNumero: input.nfNumero,
        mimeType: file.mimetype,
        originalFileName: file.originalname,
      });
      this.logger.log(
        JSON.stringify({
          event: 'comprovante_baixa',
          order_id: input.orderId,
          validacao_id: input.validacaoId?.trim() || 'nao_conferida',
          imagem_url: url,
        }),
      );
      return url;
    } catch (err) {
      this.logger.error(`Upload Spaces falhou: ${String(err)}`);
      throw new BadGatewayException(
        'Falha ao enviar a foto. Tente novamente.',
      );
    }
  }
}
