import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { ok } from '../../core/http/api-response';
import { ValidateOldPasswordUseCase } from './use-cases/validate_old_password.use-case';
import { UpdatePasswordUseCase } from './use-cases/update_password.use-case';
import { ChangePasswordDto } from './dto/change_password.dto';

@ApiTags('Senha')
@ApiBearerAuth()
@Controller()
export class ChangePasswordController {
  constructor(
    private readonly validateOldPasswordUseCase: ValidateOldPasswordUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('changePassword')
  @ApiOperation({ summary: 'Troca a senha da conta logada' })
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const oldPassword = dto.old_password ?? '';
    const newPassword = dto.new_password ?? '';

    await this.validateOldPasswordUseCase.call(user.userId, oldPassword);
    await this.updatePasswordUseCase.call(user.userId, newPassword);
    return ok();
  }
}
