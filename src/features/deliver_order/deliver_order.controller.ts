import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { FcmService } from '../../core/services/fcm/fcm.service';
import { ok } from '../../core/http/api-response';
import { NotificationType } from '../../core/shared/enums/notification-type.enum';
import { ResolveDeliveryStatusUseCase } from './use-cases/resolve_delivery_status.use-case';
import { MarkOrderDeliveredUseCase } from './use-cases/mark_order_delivered.use-case';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { CreateDeliveryHistoricoUseCase } from './use-cases/create_delivery_historico.use-case';
import { CreateDeliveryNotificationUseCase } from './use-cases/create_delivery_notification.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { FindDriverDeliveryAlertUseCase } from './use-cases/find_driver_delivery_alert.use-case';
import { DeliverOrderDto } from './dto/deliver_order.dto';

@ApiTags('Entrega')
@ApiBearerAuth()
@Controller()
export class DeliverOrderController {
  constructor(
    private readonly resolveDeliveryStatusUseCase: ResolveDeliveryStatusUseCase,
    private readonly markOrderDeliveredUseCase: MarkOrderDeliveredUseCase,
    private readonly findOrderUseCase: FindOrderUseCase,
    private readonly createDeliveryHistoricoUseCase: CreateDeliveryHistoricoUseCase,
    private readonly createDeliveryNotificationUseCase: CreateDeliveryNotificationUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly findDriverDeliveryAlertUseCase: FindDriverDeliveryAlertUseCase,
    private readonly fcm: FcmService,
    private readonly sessionAuth: SessionAuthService,
  ) { }

  @Post('deliverOrder')
  @ApiOperation({ summary: 'Confirma a entrega do pedido' })
  async deliver(@CurrentUser() user: AuthUser, @Body() dto: DeliverOrderDto) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const id = dto.id;
    const signatureName = dto.signature_name ?? '';
    const latitudeFoto = dto.latitude_foto ?? '';
    const longitudeFoto = dto.longitude_foto ?? '';
    const statusEntregue = dto.status_entregue ?? '';
    const signatureImage = dto.signature_image?.trim() || null;
    const clientImage = dto.received_user_image?.trim() || null;
    const now = new Date();
    const date = now.toISOString().slice(0, 10);

    const { orderDeliveryStatus, historicoStatusCodigo, statusTexto } =
      await this.resolveDeliveryStatusUseCase.call(statusEntregue);

    await this.markOrderDeliveredUseCase.call(id, {
      ...(clientImage ? { receivedUserImage: clientImage } : {}),
      ...(signatureImage ? { signatureImage } : {}),
      signatureName,
      latitudeFoto,
      longitudeFoto,
      updateLat: latitudeFoto,
      updateLon: longitudeFoto,
      deliveryStatus: orderDeliveryStatus,
      dataEntregue: date,
    });

    const profile = await this.findOrderUseCase.call(id);
    if (!profile) return ok();
    if (profile.idOperacao == null) {
      throw new BadRequestException(
        'id_operacao é obrigatório. Pedido sem operação cadastrada.',
      );
    }

    await this.createDeliveryHistoricoUseCase.call({
      idEntrega: profile.id,
      idOperacao: profile.idOperacao,
      idUsuario: profile.userId ?? 0,
      idMotorista: profile.driverId,
      idStatus: historicoStatusCodigo,
      dataOco: now,
      dataCad: now,
      ocorrencia: statusTexto,
      obs: statusTexto,
      lat: latitudeFoto,
      lon: longitudeFoto,
      ...(signatureImage ? { imagem: signatureImage } : {}),
    });

    if (!profile.userId) return ok();

    await this.createDeliveryNotificationUseCase.call({
      orderId: profile.id,
      fromUserId: profile.driverId ?? user.userId,
      toUserId: profile.userId,
      message: 'O pedido foi entregue',
      type: NotificationType.Deliver,
    });

    const customer = await this.findCustomerUseCase.call(profile.userId);
    const driver = await this.findDriverDeliveryAlertUseCase.call(
      profile.driverId ?? 0,
    );
    const message = [
      'O pedido foi entregue.',
      driver.name,
      `Nota: ${driver.rating}`,
    ]
      .filter((line) => line !== '')
      .join('\n');
    await this.fcm.push(
      customer?.deviceToken,
      message,
      {
        delivery_id: profile.id,
        order_id: profile.orderId ?? profile.id,
        driver_id: profile.driverId,
        driver_name: driver.name,
        driver_image: driver.image,
        driver_rating: driver.rating,
      },
      driver.image,
    );
    return ok();
  }
}
