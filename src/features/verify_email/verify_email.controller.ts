import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/auth/decorators/current-user.decorator';
import { VerifyEmailUseCase } from './use-cases/verify_email.use-case';
import { VerifyEmailDto } from './dto/verify_email.dto';

@ApiTags('E-mail')
@Controller()
export class VerifyEmailController {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) { }

  @Public()
  @Get('verifyemail')
  @ApiOperation({ summary: 'Confirma o e-mail pelo link' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'code', required: true })
  async verifyGet(
    @Query('email') email: string,
    @Query('code') code: string,
  ) {
    return this.verifyEmailUseCase.call(email ?? '', code ?? '');
  }

  @Public()
  @Post('verifyemail')
  @ApiOperation({ summary: 'Confirma o e-mail com e-mail e código' })
  async verifyPost(@Body() dto: VerifyEmailDto) {
    return this.verifyEmailUseCase.call(dto.email ?? '', dto.code ?? '');
  }
}
