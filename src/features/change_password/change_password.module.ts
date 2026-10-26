import { Module } from '@nestjs/common';
import { ChangePasswordController } from './change_password.controller';
import { ValidateOldPasswordUseCase } from './use-cases/validate_old_password.use-case';
import { UpdatePasswordUseCase } from './use-cases/update_password.use-case';
import { ChangePasswordRepository } from './repositories/change_password.repository';

@Module({
  controllers: [ChangePasswordController],
  providers: [
    ValidateOldPasswordUseCase,
    UpdatePasswordUseCase,
    ChangePasswordRepository,
  ],
})
export class ChangePasswordModule {}
