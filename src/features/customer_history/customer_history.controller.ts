import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { CustomerHistoryUseCase } from './use-cases/customer_history.use-case';

@ApiTags('Histórico')
@ApiBearerAuth()
@Controller()
export class CustomerHistoryController {
  constructor(
    private readonly customerHistoryUseCase: CustomerHistoryUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('customerOrderHistory')
  @ApiOperation({ summary: 'Histórico de pedidos do cliente' })
  async customerOrderHistory(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.customerHistoryUseCase.call(user.userId);
  }
}
