import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { FcmService } from '../../core/services/fcm/fcm.service';
import { ok } from '../../core/http/api-response';
import { NotificationType } from '../../core/shared/enums/notification-type.enum';
import { UserType } from '../../core/shared/enums/user-type.enum';
import { GetUserTypeUseCase } from './use-cases/get_user_type.use-case';
import { CancelAsCustomerUseCase } from './use-cases/cancel_as_customer.use-case';
import { CancelAsDriverUseCase } from './use-cases/cancel_as_driver.use-case';
import { CreateCancelNotificationUseCase } from './use-cases/create_cancel_notification.use-case';
import { CancelDeliveryRepository } from './repositories/cancel_delivery.repository';
import { CancelDeliveryDto } from './dto/cancel_delivery.dto';

@ApiTags('Cancelamento')
@ApiBearerAuth()
@Controller()
export class CancelDeliveryController {
  constructor(
    private readonly getUserTypeUseCase: GetUserTypeUseCase,
    private readonly cancelAsCustomerUseCase: CancelAsCustomerUseCase,
    private readonly cancelAsDriverUseCase: CancelAsDriverUseCase,
    private readonly createCancelNotificationUseCase: CreateCancelNotificationUseCase,
    private readonly repository: CancelDeliveryRepository,
    private readonly fcm: FcmService,
    private readonly sessionAuth: SessionAuthService,
  ) { }

  @Post('cancelDelivery')
  @ApiOperation({ summary: 'Cancela a entrega' })
  async cancel(
    @CurrentUser() user: AuthUser,
    @Body() dto: CancelDeliveryDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const orderId = dto.order_id ?? '';
    const userType = await this.getUserTypeUseCase.call(user.userId);
    const isCustomer = userType === UserType.Customer;
    const order = await this.repository.findOrderByOrderId(orderId);

    if (isCustomer) {
      await this.cancelAsCustomerUseCase.call(orderId, user.userId);
    } else {
      await this.cancelAsDriverUseCase.call(orderId, user.userId);
    }

    const toUserId = isCustomer
      ? order?.driverId || undefined
      : order?.userId || undefined;

    if (isCustomer && order) {
      await this.createCancelNotificationUseCase.call({
        orderId: order.id,
        fromUserId: user.userId,
        toUserId: user.userId,
        message: 'Pedido cancelado com sucesso',
        type: NotificationType.Cancel,
      });
    }

    if (toUserId && order) {
      await this.createCancelNotificationUseCase.call({
        orderId: order.id,
        fromUserId: user.userId,
        toUserId,
        message: 'Pedido cancelado com sucesso',
        type: NotificationType.Cancel,
      });
      const target = await this.repository.findUser(toUserId);
      await this.fcm.push(target?.deviceToken, 'Pedido cancelado com sucesso', {
        delivery_id: order.id,
        order_id: order.orderId ?? orderId,
      });
    }

    return ok();
  }
}
