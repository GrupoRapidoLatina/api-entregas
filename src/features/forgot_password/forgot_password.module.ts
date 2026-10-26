import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './forgot_password.controller';
import { FindUserByEmailUseCase } from './use-cases/find_user_by_email.use-case';
import { MarkForgetPasswordTimeUseCase } from './use-cases/mark_forget_password_time.use-case';
import { CreatePasswordResetLinkUseCase } from './use-cases/create_password_reset_link.use-case';
import { SendPasswordResetEmailUseCase } from './use-cases/send_password_reset_email.use-case';
import { VerifyPasswordResetTokenUseCase } from './use-cases/verify_password_reset_token.use-case';
import { ValidatePasswordResetRequestUseCase } from './use-cases/validate_password_reset_request.use-case';
import { ResetPasswordUseCase } from './use-cases/reset_password.use-case';
import { ForgotPasswordRepository } from './repositories/forgot_password.repository';

@Module({
  controllers: [ForgotPasswordController],
  providers: [
    FindUserByEmailUseCase,
    MarkForgetPasswordTimeUseCase,
    CreatePasswordResetLinkUseCase,
    SendPasswordResetEmailUseCase,
    VerifyPasswordResetTokenUseCase,
    ValidatePasswordResetRequestUseCase,
    ResetPasswordUseCase,
    ForgotPasswordRepository,
  ],
})
export class ForgotPasswordModule { }
