import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { ok } from '../../core/http/api-response';
import { UpdateDriverLocationUseCase } from './use-cases/update_driver_location.use-case';
import { GetUserVehicleTypeUseCase } from './use-cases/get_user_vehicle_type.use-case';
import { FindNearbyDeliveriesUseCase } from './use-cases/find_nearby_deliveries.use-case';
import { NearbyDeliveryBoysUseCase } from './use-cases/nearby_delivery_boys.use-case';
import { NearbyDeliveriesDto } from './dto/nearby_deliveries.dto';
import { NearbyDeliveryBoysDto } from './dto/nearby_delivery_boys.dto';

@ApiTags('Entregas próximas')
@ApiBearerAuth()
@Controller()
export class NearbyDeliveriesController {
  constructor(
    private readonly updateDriverLocationUseCase: UpdateDriverLocationUseCase,
    private readonly getUserVehicleTypeUseCase: GetUserVehicleTypeUseCase,
    private readonly findNearbyDeliveriesUseCase: FindNearbyDeliveriesUseCase,
    private readonly nearbyDeliveryBoysUseCase: NearbyDeliveryBoysUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('getNearByDeliveries')
  @ApiOperation({ summary: 'Lista pedidos disponíveis perto do motoboy' })
  async getNearByDeliveries(
    @CurrentUser() user: AuthUser,
    @Body() dto: NearbyDeliveriesDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const latitude = dto.latitude ?? '';
    const longitude = dto.longitude ?? '';

    await this.updateDriverLocationUseCase.call(user.userId, latitude, longitude);
    const vehicleType = await this.getUserVehicleTypeUseCase.call(user.userId);
    const rows = await this.findNearbyDeliveriesUseCase.call(
      latitude,
      longitude,
      vehicleType,
    );

    return ok({
      items: rows,
      remain: [],
    });
  }

  @Post('getNearByDeliveryBoys')
  @ApiOperation({ summary: 'Lista motoboys perto de um ponto' })
  getNearByDeliveryBoys(@Body() dto: NearbyDeliveryBoysDto) {
    return this.nearbyDeliveryBoysUseCase.call(dto);
  }

  @Post('updateLocation')
  @ApiOperation({ summary: 'Atualiza a localização do motoboy' })
  async updateLocation(
    @CurrentUser() user: AuthUser,
    @Body() dto: NearbyDeliveriesDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);
    await this.updateDriverLocationUseCase.call(
      user.userId,
      dto.latitude ?? '',
      dto.longitude ?? '',
    );
    return ok();
  }
}
