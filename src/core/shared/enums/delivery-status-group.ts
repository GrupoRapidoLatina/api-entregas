import { DeliveryStatus } from './delivery-status.enum';

export const DeliveryStatusGroup = {
  driverCurrent: [
    DeliveryStatus.Waiting,
    DeliveryStatus.Accepted,
    DeliveryStatus.InProgress,
  ],
  customerCurrent: [
    DeliveryStatus.Available,
    DeliveryStatus.Legacy6,
    DeliveryStatus.Legacy7,
    DeliveryStatus.Waiting,
  ],
  driverHistory: [
    DeliveryStatus.Available,
    DeliveryStatus.Legacy6,
    DeliveryStatus.Legacy7,
  ],
  customerHistory: [
    DeliveryStatus.Delivered,
    DeliveryStatus.InProgress,
    DeliveryStatus.Legacy8,
    DeliveryStatus.PedidoCancelado,
    DeliveryStatus.TransporteCancelado,
  ],
} as const;
