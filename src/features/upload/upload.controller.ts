import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Public } from '../../core/auth/decorators/current-user.decorator';
import { FileUploadService } from '../../core/services/file-upload/file-upload.service';
import { imageUrl } from '../../core/helpers/image-url.helper';
import { ok } from '../../core/http/api-response';

@ApiTags('Upload')
@Controller()
export class UploadController {
  constructor(private readonly fileUpload: FileUploadService) { }

  @Public()
  @Post('upload')
  @ApiOperation({ summary: 'Envia um arquivo e devolve a URL' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'user_id'],
      properties: {
        file: { type: 'string', format: 'binary' },
        user_id: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: { user_id?: string },
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Arquivo é obrigatório');
    }
    const userId = body?.user_id?.trim() ?? '';
    if (!userId) {
      throw new BadRequestException('user_id é obrigatório para upload');
    }
    const filename = await this.fileUpload.uploadMulterFile(
      file,
      '',
      userId,
    );
    return ok({
      user_id: userId,
      filename,
      url: imageUrl(filename),
    });
  }
}
