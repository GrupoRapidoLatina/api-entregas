import { Injectable, NotFoundException } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { resolveDeliveryPrice } from '../../../core/helpers/delivery-price.helper';
import { GetSettingsDto } from '../dto/get_settings.dto';
import { SettingsPricesRepository } from '../repositories/settings_prices.repository';

@Injectable()
export class SettingsPricesUseCase {
  constructor(private readonly repository: SettingsPricesRepository) { }

  async call(dto: GetSettingsDto = {}) {
    const profiledata = await this.repository.findPrices();
    if (!profiledata) throw new NotFoundException('Sem dados disponíveis !');

    const fourHourEnabled = process.env.FOUR_HOUR_ENABLED !== 'false';
    const sameDayEnabled = process.env.SAME_DAY_ENABLED !== 'false';
    const price = dto.vehicle_type
      ? resolveDeliveryPrice(profiledata, dto.vehicle_type, dto.delivery_type)
      : null;

    return ok({
      price,
      vehicle: {
        currency: 'BRL',
        admin_percentage: profiledata.driverPercentage,
      },
      fourHourEnabled,
      sameDayEnabled,
      fourStatus: !fourHourEnabled,
      sameStatus: !sameDayEnabled,
    });
  }
}
