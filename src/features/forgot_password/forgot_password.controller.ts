import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/auth/decorators/current-user.decorator';
import { ok } from '../../core/http/api-response';
import { FindUserByEmailUseCase } from './use-cases/find_user_by_email.use-case';
import { MarkForgetPasswordTimeUseCase } from './use-cases/mark_forget_password_time.use-case';
import { CreatePasswordResetLinkUseCase } from './use-cases/create_password_reset_link.use-case';
import { SendPasswordResetEmailUseCase } from './use-cases/send_password_reset_email.use-case';
import { VerifyPasswordResetTokenUseCase } from './use-cases/verify_password_reset_token.use-case';
import { ValidatePasswordResetRequestUseCase } from './use-cases/validate_password_reset_request.use-case';
import { ResetPasswordUseCase } from './use-cases/reset_password.use-case';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';

@ApiTags('Senha')
@Controller()
export class ForgotPasswordController {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly markForgetPasswordTimeUseCase: MarkForgetPasswordTimeUseCase,
    private readonly createPasswordResetLinkUseCase: CreatePasswordResetLinkUseCase,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
    private readonly verifyPasswordResetTokenUseCase: VerifyPasswordResetTokenUseCase,
    private readonly validatePasswordResetRequestUseCase: ValidatePasswordResetRequestUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) { }

  @Public()
  @Post('forgetPassword')
  @ApiOperation({ summary: 'Envia o link para redefinir a senha' })
  async forgetPassword(@Body() dto: ForgotPasswordDto) {
    const email = dto.email ?? '';
    const user = await this.findUserByEmailUseCase.call(email);
    if (!user.email) {
      throw new BadRequestException('E-mail inválido!');
    }

    await this.markForgetPasswordTimeUseCase.call(user.userId);
    const { resetUrl } = this.createPasswordResetLinkUseCase.call(
      user.userId,
      user.email,
    );
    await this.sendPasswordResetEmailUseCase.call({
      email: user.email,
      firstname: user.firstname ?? '',
      resetUrl,
    });

    return ok();
  }

  @Public()
  @Post('reset_password')
  @ApiOperation({ summary: 'Redefine a senha com o token do e-mail' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const { email, iat } = this.verifyPasswordResetTokenUseCase.call(dto.token);
    await this.validatePasswordResetRequestUseCase.call(email, iat);

    const updated = await this.resetPasswordUseCase.call(email, dto.password);
    if (!updated.count) {
      throw new BadRequestException(
        'Senha não redefinida, por favor, tente novamente',
      );
    }

    return ok();
  }
}
