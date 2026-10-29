import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import {
  COMPROVANTE_ALLOWED_MIME_TYPE_SET,
  COMPROVANTE_MAX_BYTES,
} from '../../core/config/comprovante.config';
import { isFinalizedDelivery } from '../../core/helpers/is-finalized-delivery.helper';
import { ok } from '../../core/http/api-response';
import { ComprovanteService } from '../../core/services/comprovante/comprovante.service';
import { ValidarComprovanteDto } from './dto/validar_comprovante.dto';
import { AssinarComprovanteUseCase } from './use-cases/assinar_comprovante.use-case';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { ValidarComprovanteUseCase } from './use-cases/validar_comprovante.use-case';

@ApiTags('Comprovante')
@ApiBearerAuth()
@ApiExtraModels(ValidarComprovanteDto)
@Controller()
export class ValidarComprovanteController {
  constructor(
    private readonly findOrderUseCase: FindOrderUseCase,
    private readonly validarComprovanteUseCase: ValidarComprovanteUseCase,
    private readonly assinarComprovanteUseCase: AssinarComprovanteUseCase,
    private readonly comprovante: ComprovanteService,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('validarComprovante')
  @ApiOperation({ summary: 'Confere a foto do comprovante na ocorrência 5' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ValidarComprovanteDto) },
        {
          type: 'object',
          required: ['imagem'],
          properties: {
            imagem: {
              type: 'string',
              format: 'binary',
              description: 'Foto do comprovante',
            },
          },
        },
      ],
    },
  })
  @UseInterceptors(
    FileInterceptor('imagem', {
      storage: memoryStorage(),
      limits: { fileSize: COMPROVANTE_MAX_BYTES },
    }),
  )
  async validar(
    @CurrentUser() user: AuthUser,
    @Body() dto: ValidarComprovanteDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    if (!this.comprovante.tryConsumeRateLimit(`app:user:${user.userId}`)) {
      throw new HttpException(
        'Limite de conferências excedido. Tente de novo em instantes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!file?.buffer?.length) {
      throw new BadRequestException('imagem é obrigatória');
    }
    if (file.size > COMPROVANTE_MAX_BYTES) {
      throw new BadRequestException('Foto deve ter no máximo 15 MB');
    }
    if (
      file.mimetype &&
      !COMPROVANTE_ALLOWED_MIME_TYPE_SET.has(file.mimetype.toLowerCase())
    ) {
      throw new BadRequestException('Formato de foto não suportado');
    }

    const order = await this.findOrderUseCase.call(dto.id);
    if (isFinalizedDelivery(order.deliveryStatus)) {
      throw new ConflictException('Entrega já finalizada');
    }

    const resultado = await this.validarComprovanteUseCase.call({
      orderId: order.id,
      nfNumero: order.nfNumero,
      file,
    });
    const assinatura = this.assinarComprovanteUseCase.call({
      orderId: order.id,
      sha256: resultado.sha256,
      validacaoId: resultado.validacaoId,
      veredito: resultado.veredito,
    });

    return ok({
      validacao_id: resultado.validacaoId,
      veredito: resultado.veredito,
      motivos: resultado.motivos,
      assinatura,
      sha256: resultado.sha256,
      tempo_ms: resultado.tempoMs,
    });
  }
}
