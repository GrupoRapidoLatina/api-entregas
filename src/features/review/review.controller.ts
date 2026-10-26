import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { ReviewUseCase } from './use-cases/review.use-case';
import { ReviewDto } from './dto/review.dto';

@ApiTags('Avaliação')
@ApiBearerAuth()
@Controller()
export class ReviewController {
  constructor(
    private readonly reviewUseCase: ReviewUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) { }

  @Post('review')
  @ApiOperation({ summary: 'Avalia a entrega' })
  async review(
    @CurrentUser() user: AuthUser,
    @Body() dto: ReviewDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.reviewUseCase.call(dto);
  }
}
