import { Controller, Get, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '../core/database/prisma.service';
import { Public } from '../core/auth/decorators/current-user.decorator';

@ApiTags('Saúde')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Verifica a API e o banco' })
  @ApiOkResponse({ description: 'Banco no ar' })
  @ApiServiceUnavailableResponse({ description: 'Banco indisponível' })
  async health(@Res() res: { status: (code: number) => { json: (body: unknown) => unknown } }) {
    let db: 'up' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = 'up';
    } catch {
      db = 'down';
    }
    const body = {
      status: db === 'up' ? 'ok' : 'degraded',
      service: 'rapido-entregas-api',
      env: process.env.APP_ENV || 'unknown',
      db,
      ts: new Date().toISOString(),
    };
    if (db === 'down') {
      return res.status(503).json(body);
    }
    return res.status(200).json(body);
  }
}
