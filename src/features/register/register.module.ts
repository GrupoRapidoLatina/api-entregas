import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { EnsureEmailAvailableUseCase } from './use-cases/ensure_email_available.use-case';
import { CreateUserUseCase } from './use-cases/create_user.use-case';
import { RegisterRepository } from './repositories/register.repository';

@Module({
  controllers: [RegisterController],
  providers: [
    EnsureEmailAvailableUseCase,
    CreateUserUseCase,
    RegisterRepository,
  ],
})
export class RegisterModule {}
