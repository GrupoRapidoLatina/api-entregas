import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { CreateOrderUseCase } from './use-cases/create_order.use-case';
import { ResolveDeliveryPriceUseCase } from './use-cases/resolve_delivery_price.use-case';
import { RescheduleOrderUseCase } from './use-cases/reschedule_order.use-case';
import { CreateOrderDto } from './dto/create_order.dto';
import { RescheduleOrderDto } from './dto/reschedule_order.dto';

@ApiTags('Pedido')
@ApiBearerAuth()
@Controller()
export class CreateOrderController {
  constructor(
    private readonly resolveDeliveryPriceUseCase: ResolveDeliveryPriceUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly rescheduleOrderUseCase: RescheduleOrderUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('create_order')
  @ApiOperation({ summary: 'Cria o pedido com o preço do veículo e do prazo' })
  async create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    await this.sessionAuth.requireActiveUser(user.userId);
    const deliveryCost = await this.resolveDeliveryPriceUseCase.call(
      dto.vehicle_type,
      dto.delivery_type,
    );
    return this.createOrderUseCase.call(user.userId, dto, deliveryCost);
  }

  @Post('rescheduleOrder')
  @ApiOperation({ summary: 'Reagenda o pedido' })
  reschedule(@Body() dto: RescheduleOrderDto) {
    return this.rescheduleOrderUseCase.call(dto);
  }
}
