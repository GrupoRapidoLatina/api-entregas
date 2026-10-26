import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/auth/decorators/current-user.decorator';
import { VersaoAtualUseCase } from './use-cases/versao_atual.use-case';
import { LocParceiroUseCase } from './use-cases/loc_parceiro.use-case';
import { LocParceiroDto } from './dto/loc_parceiro.dto';

@ApiTags('Parceiros')
@Controller()
export class PartnersController {
  constructor(
    private readonly versaoAtualUseCase: VersaoAtualUseCase,
    private readonly locParceiroUseCase: LocParceiroUseCase,
  ) {}

  @Public()
  @Post('versaoAtual')
  @ApiOperation({ summary: 'Versão atual do app' })
  versaoAtual() {
    return this.versaoAtualUseCase.call();
  }

  @Public()
  @Post('locParceiro')
  @ApiOperation({ summary: 'Localiza o parceiro' })
  locParceiro(@Body() dto: LocParceiroDto) {
    return this.locParceiroUseCase.call(dto);
  }
}
