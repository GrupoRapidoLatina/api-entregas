import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryDetailUseCase } from './use-cases/delivery_detail.use-case';
import { DeliveryDetailDto } from './dto/delivery_detail.dto';

@ApiTags('Pedido')
@ApiBearerAuth()
@Controller()
export class DeliveryDetailController {
  constructor(
    private readonly deliveryDetailUseCase: DeliveryDetailUseCase,
  ) {}

  @Post('deliveryDetail')
  @ApiOperation({ summary: 'Detalhe de um pedido' })
  deliveryDetail(@Body() dto: DeliveryDetailDto) {
    return this.deliveryDetailUseCase.call(dto);
  }
}
