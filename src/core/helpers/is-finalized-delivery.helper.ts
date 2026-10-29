import { DeliveryStatus } from '../shared/enums/delivery-status.enum';

export function isFinalizedDelivery(
  deliveryStatus: number | null | undefined,
): boolean {
  if (deliveryStatus == null) return false;
  if (deliveryStatus === DeliveryStatus.Delivered) return true;
  if (deliveryStatus === DeliveryStatus.TransporteCancelado) return true;
  if (deliveryStatus === DeliveryStatus.PedidoCancelado) return true;
  if (deliveryStatus === 35) return true;
  if (deliveryStatus < 5 || deliveryStatus > 10) return false;
  return deliveryStatus !== DeliveryStatus.Available;
}
