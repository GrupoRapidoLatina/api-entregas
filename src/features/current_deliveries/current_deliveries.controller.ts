import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { DriverDeliveriesUseCase } from './use-cases/driver_deliveries.use-case';
import { UserDeliveriesUseCase } from './use-cases/user_deliveries.use-case';

@ApiTags('Entregas atuais')
@ApiBearerAuth()
@Controller()
export class CurrentDeliveriesController {
  constructor(
    private readonly driverDeliveriesUseCase: DriverDeliveriesUseCase,
    private readonly userDeliveriesUseCase: UserDeliveriesUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('get_driver_deliveries')
  @ApiOperation({ summary: 'Entregas em andamento do motoboy' })
  async getDriverDeliveries(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.driverDeliveriesUseCase.call(user.userId);
  }

  @Post('get_user_deliveries')
  @ApiOperation({ summary: 'Entregas em andamento do cliente' })
  async getUserDeliveries(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.userDeliveriesUseCase.call(user.userId);
  }
}
