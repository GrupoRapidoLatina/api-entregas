import { Module } from '@nestjs/common';
import { VerifyEmailController } from './verify_email.controller';
import { VerifyEmailUseCase } from './use-cases/verify_email.use-case';
import { VerifyEmailRepository } from './repositories/verify_email.repository';

@Module({
  controllers: [VerifyEmailController],
  providers: [VerifyEmailUseCase, VerifyEmailRepository],
})
export class VerifyEmailModule { }
