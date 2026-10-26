import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { DriverHistoryUseCase } from './use-cases/driver_history.use-case';

@ApiTags('Histórico')
@ApiBearerAuth()
@Controller()
export class DriverHistoryController {
  constructor(
    private readonly driverHistoryUseCase: DriverHistoryUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('driverOrderHistory')
  @ApiOperation({ summary: 'Histórico de pedidos do motoboy' })
  async driverOrderHistory(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.driverHistoryUseCase.call(user.userId);
  }
}
