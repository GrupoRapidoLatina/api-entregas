import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { FcmService } from '../../core/services/fcm/fcm.service';
import { ok } from '../../core/http/api-response';
import { NotificationType } from '../../core/shared/enums/notification-type.enum';
import { DeliveryMicroStatus } from '../../core/shared/enums/delivery-micro-status.enum';
import { RequireStatusUseCase } from '../status/use-cases/require_status.use-case';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { MarkPickupUseCase } from './use-cases/mark_pickup.use-case';
import { CreatePickupHistoricoUseCase } from './use-cases/create_pickup_historico.use-case';
import { CreatePickupNotificationUseCase } from './use-cases/create_pickup_notification.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { PickupDeliveryDto } from './dto/pickup_delivery.dto';

@ApiTags('Coleta')
@ApiBearerAuth()
@Controller()
export class PickupDeliveryController {
  constructor(
    private readonly findOrderUseCase: FindOrderUseCase,
    private readonly markPickupUseCase: MarkPickupUseCase,
    private readonly createPickupHistoricoUseCase: CreatePickupHistoricoUseCase,
    private readonly createPickupNotificationUseCase: CreatePickupNotificationUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly requireStatus: RequireStatusUseCase,
    private readonly fcm: FcmService,
    private readonly sessionAuth: SessionAuthService,
  ) { }

  @Post('pickupdelivery')
  @ApiOperation({ summary: 'Confirma a coleta do pedido' })
  async pickup(
    @CurrentUser() user: AuthUser,
    @Body() dto: PickupDeliveryDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const id = dto.id;
    const now = new Date();
    const order = await this.findOrderUseCase.call(id);
    if (order.idOperacao == null) {
      throw new BadRequestException(
        'id_operacao é obrigatório. Pedido sem operação cadastrada.',
      );
    }
    const status = await this.requireStatus.call(
      DeliveryMicroStatus.ColetaRealizada,
    );

    await this.markPickupUseCase.call(id, user.userId);
    await this.createPickupHistoricoUseCase.call({
      idEntrega: order.id,
      idOperacao: order.idOperacao,
      idUsuario: order.userId ?? 0,
      idMotorista: order.driverId,
      idStatus: status.codigo,
      dataOco: now,
      dataCad: now,
      ocorrencia: status.microStatus,
      obs: status.microStatus,
      lat: '0',
      lon: '0',
      imagem: '',
    });

    if (order.userId) {
      await this.createPickupNotificationUseCase.call({
        orderId: order.id,
        fromUserId: user.userId,
        toUserId: order.userId,
        message: 'O motorista coletou o pedido',
        type: NotificationType.Pickup,
      });
      const customer = await this.findCustomerUseCase.call(order.userId);
      await this.fcm.push(
        customer?.deviceToken,
        'O motorista coletou o pedido.',
        {
          delivery_id: order.id,
          order_id: order.orderId ?? order.id,
        },
      );
    }

    return ok();
  }
}
