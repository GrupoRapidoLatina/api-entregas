import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { FcmService } from '../../core/services/fcm/fcm.service';
import { ok } from '../../core/http/api-response';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { CreateDriverReportUseCase } from './use-cases/create_driver_report.use-case';
import { ResolveReportStatusUseCase } from './use-cases/resolve_report_status.use-case';
import { MarkOrderAfterReportUseCase } from './use-cases/mark_order_after_report.use-case';
import { CreateReportHistoricoUseCase } from './use-cases/create_report_historico.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { ChangeReportProblemStatusUseCase } from './use-cases/change_report_problem_status.use-case';
import { UploadReportImageUseCase } from './use-cases/upload_report_image.use-case';
import { ReportProblemDto } from './dto/report_problem.dto';
import { ChangeReportProblemStatusDto } from './dto/change_report_problem_status.dto';

@ApiTags('Problema')
@ApiBearerAuth()
@ApiExtraModels(ReportProblemDto)
@Controller()
export class ReportProblemController {
  constructor(
    private readonly findOrderUseCase: FindOrderUseCase,
    private readonly createDriverReportUseCase: CreateDriverReportUseCase,
    private readonly resolveReportStatusUseCase: ResolveReportStatusUseCase,
    private readonly markOrderAfterReportUseCase: MarkOrderAfterReportUseCase,
    private readonly createReportHistoricoUseCase: CreateReportHistoricoUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly changeReportProblemStatusUseCase: ChangeReportProblemStatusUseCase,
    private readonly uploadReportImageUseCase: UploadReportImageUseCase,
    private readonly fcm: FcmService,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('reportProblem')
  @ApiOperation({ summary: 'Relata um problema na entrega' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ReportProblemDto) },
        {
          type: 'object',
          properties: {
            report_image: {
              type: 'string',
              format: 'binary',
              description: 'Foto do problema',
            },
          },
        },
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'report_image', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  async report(
    @CurrentUser() user: AuthUser,
    @Body() dto: ReportProblemDto,
    @UploadedFiles() files: { report_image?: Express.Multer.File[] },
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const id = dto.id ?? dto.delivery_id;
    if (!id) {
      throw new BadRequestException('id (delivery_id) é obrigatório');
    }
    const comment = (dto.comment ?? dto.problem ?? '').trim();
    const message = (dto.message ?? '').trim();
    if (!message) {
      throw new BadRequestException('message (micro_status) é obrigatório');
    }
    const geoLat = dto.lat ?? '';
    const geoLon = dto.lon ?? '';
    const now = new Date();

    const order = await this.findOrderUseCase.call(id);
    if (order.idOperacao == null) {
      throw new BadRequestException(
        'id_operacao é obrigatório. Pedido sem operação cadastrada.',
      );
    }

    const imagePath = await this.uploadReportImageUseCase.call({
      orderId: id,
      nfNumero: dto.nfnumero || order.nfNumero,
      file: files?.report_image?.[0],
      fallbackPath: dto.image_path,
    });

    const { orderDeliveryStatus, historicoStatusCodigo, statusTexto } =
      await this.resolveReportStatusUseCase.call(message);

    await this.createDriverReportUseCase.call({
      idEntrega: id,
      orderId: dto.order_id || order.orderId || '',
      comment: comment,
      driverId: user.userId,
      message,
      geoLat,
      geoLon,
      imagem: imagePath,
      nfNumero: dto.nfnumero ?? '',
    });

    await this.markOrderAfterReportUseCase.call(id, {
      deliveryStatus: orderDeliveryStatus,
      insucessoLat: geoLat,
      insucessoLon: geoLon,
      updateLat: geoLat,
      updateLon: geoLon,
      ...(imagePath ? { updateImagem: imagePath } : {}),
    });

    await this.createReportHistoricoUseCase.call({
      idEntrega: order.id,
      idOperacao: order.idOperacao,
      idUsuario: order.userId ?? 0,
      idMotorista: order.driverId ?? user.userId,
      idStatus: historicoStatusCodigo,
      dataOco: now,
      dataCad: now,
      ocorrencia: statusTexto,
      obs: statusTexto,
      lat: geoLat || '0',
      lon: geoLon || '0',
      imagem: imagePath || '',
    });

    if (order.userId) {
      const customer = await this.findCustomerUseCase.call(order.userId);
      await this.fcm.push(
        customer?.deviceToken,
        'O motorista relatou um problema ao seu pedido',
        {
          delivery_id: order.id,
          order_id: dto.order_id || order.orderId || order.id,
        },
      );
    }

    return ok();
  }

  @Post('changeReportproblemstatus')
  @ApiOperation({ summary: 'Altera o status do problema relatado' })
  async changeReport(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangeReportProblemStatusDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.changeReportProblemStatusUseCase.call(user.userId, dto);
  }
}
