import { Injectable } from '@nestjs/common';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';
import { RequireStatusUseCase } from '../../status/use-cases/require_status.use-case';

@Injectable()
export class ResolveDeliveryStatusUseCase {
  constructor(private readonly requireStatus: RequireStatusUseCase) { }

  async call(statusEntregue: string) {
    const status = await this.requireStatus.call(statusEntregue);
    return {
      orderDeliveryStatus: DeliveryStatus.Delivered,
      historicoStatusCodigo: status.codigo,
      statusTexto: status.microStatus,
    };
  }
}
