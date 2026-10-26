import { Module } from '@nestjs/common';
import { SettingsPricesController } from './settings_prices.controller';
import { SettingsPricesUseCase } from './use-cases/settings_prices.use-case';
import { SettingsPricesRepository } from './repositories/settings_prices.repository';

@Module({
  controllers: [SettingsPricesController],
  providers: [SettingsPricesUseCase, SettingsPricesRepository],
})
export class SettingsPricesModule {}
