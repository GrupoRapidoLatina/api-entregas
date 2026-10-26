import { Injectable } from '@nestjs/common';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';
import { RequireStatusUseCase } from '../../status/use-cases/require_status.use-case';

@Injectable()
export class ResolveReportStatusUseCase {
  constructor(private readonly requireStatus: RequireStatusUseCase) { }

  async call(message: string) {
    const status = await this.requireStatus.call(message);
    return {
      orderDeliveryStatus: DeliveryStatus.Legacy6,
      historicoStatusCodigo: status.codigo,
      statusTexto: status.microStatus,
    };
  }
}
