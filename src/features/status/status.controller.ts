import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { ListStatusesUseCase } from './use-cases/list_statuses.use-case';
import { ListStatusDto } from './dto/list_status.dto';

@ApiTags('Status')
@ApiBearerAuth()
@Controller()
export class StatusController {
  constructor(
    private readonly listStatusesUseCase: ListStatusesUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('status')
  @ApiOperation({ summary: 'Lista os status de entrega' })
  async list(@CurrentUser() user: AuthUser, @Body() dto: ListStatusDto) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.listStatusesUseCase.call(dto.tipo);
  }
}
