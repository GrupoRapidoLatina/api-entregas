import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSettingsDto } from './dto/get_settings.dto';
import { SettingsPricesUseCase } from './use-cases/settings_prices.use-case';

@ApiTags('Preços')
@ApiBearerAuth()
@Controller()
export class SettingsPricesController {
  constructor(private readonly settingsPricesUseCase: SettingsPricesUseCase) { }

  @Post('getSettings')
  @ApiOperation({ summary: 'Preço do veículo e do prazo, e as janelas ligadas' })
  getSettings(@Body() dto: GetSettingsDto) {
    return this.settingsPricesUseCase.call(dto);
  }
}
