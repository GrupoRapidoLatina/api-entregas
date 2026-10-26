import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { NotificationsUseCase } from './use-cases/notifications.use-case';

@ApiTags('Notificações')
@ApiBearerAuth()
@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsUseCase: NotificationsUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('notifications')
  @ApiOperation({ summary: 'Lista as notificações da conta logada' })
  async list(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.notificationsUseCase.call(user.userId);
  }
}
