import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { FcmService } from '../../core/services/fcm/fcm.service';
import { ok } from '../../core/http/api-response';
import { FindUnassignedOrderUseCase } from './use-cases/find_unassigned_order.use-case';
import { AssignDriverUseCase } from './use-cases/assign_driver.use-case';
import { CreateOrderNotificationUseCase } from './use-cases/create_order_notification.use-case';
import { FindCustomerUseCase } from './use-cases/find_customer.use-case';
import { NotificationType } from '../../core/shared/enums/notification-type.enum';
import { AcceptDeliveryDto } from './dto/accept_delivery.dto';

@ApiTags('Aceitar entrega')
@ApiBearerAuth()
@Controller()
export class AcceptDeliveryController {
  constructor(
    private readonly findUnassignedOrderUseCase: FindUnassignedOrderUseCase,
    private readonly assignDriverUseCase: AssignDriverUseCase,
    private readonly createOrderNotificationUseCase: CreateOrderNotificationUseCase,
    private readonly findCustomerUseCase: FindCustomerUseCase,
    private readonly fcm: FcmService,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('acceptDeliveryRequest')
  @ApiOperation({ summary: 'Motoboy aceita um pedido disponível' })
  async accept(
    @CurrentUser() user: AuthUser,
    @Body() dto: AcceptDeliveryDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const orderId = dto.order_id ?? '';
    const profiledata = await this.findUnassignedOrderUseCase.call(orderId);

    await this.assignDriverUseCase.call(orderId, user.userId);
    await this.createOrderNotificationUseCase.call({
      orderId: profiledata.id,
      fromUserId: user.userId,
      toUserId: profiledata.userId ?? undefined,
      message:
        'Seu pedido foi aceito! Um motoboy já está a caminho da coleta.',
      type: NotificationType.Accept,
    });

    if (profiledata.userId) {
      const customer = await this.findCustomerUseCase.call(profiledata.userId);
      await this.fcm.push(
        customer?.deviceToken,
        'Seu pedido foi aceito! Um motoboy já está a caminho da coleta.',
        {
          delivery_id: profiledata.id,
          order_id: profiledata.orderId ?? profiledata.id,
        },
      );
    }

    return ok();
  }
}
