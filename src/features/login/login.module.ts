import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { AuthenticateCredentialsUseCase } from './use-cases/authenticate_credentials.use-case';
import { UpdateLoginSessionUseCase } from './use-cases/update_login_session.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { LoginRepository } from './repositories/login.repository';

@Module({
  controllers: [LoginController],
  providers: [
    AuthenticateCredentialsUseCase,
    UpdateLoginSessionUseCase,
    LogoutUseCase,
    LoginRepository,
  ],
})
export class LoginModule {}
