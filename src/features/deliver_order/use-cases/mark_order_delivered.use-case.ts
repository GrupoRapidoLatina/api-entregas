import { Injectable } from '@nestjs/common';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class MarkOrderDeliveredUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

  call(
    id: number,
    data: {
      receivedUserImage?: string;
      signatureImage?: string;
      signatureName: string;
      latitudeFoto: string;
      longitudeFoto: string;
      updateLat: string;
      updateLon: string;
      deliveryStatus: DeliveryStatus;
      dataEntregue: string;
    },
  ) {
    return this.repository.updateDelivered(id, data);
  }
}
