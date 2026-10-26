import { formatClock, formatDateOnly, formatDateTime } from '../helpers/date.helper';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderModel } from './models/order.model';

export function toOrderResponse(order: OrderModel): OrderResponseDto {
  return {
    id: order.id,
    order_id: order.orderId,
    user_id: order.userId,
    driver_id: order.driverId,
    pickupaddress: order.pickupaddress,
    dropoffaddress: order.dropoffaddress,
    pickup_first_name: order.pickupFirstName,
    pickup_last_name: order.pickupLastName,
    pickup_mob_number: order.pickupMobNumber,
    dropoff_first_name: order.dropoffFirstName,
    dropoff_last_name: order.dropoffLastName,
    dropoff_mob_number: order.dropoffMobNumber,
    delivery_status: order.deliveryStatus ?? null,
    delivery_date: formatDateOnly(order.deliveryDate),
    delivery_time:
      formatClock(order.deliveryTime) ?? formatClock(order.deliveryDate),
    delivery_cost: order.deliveryCost,
    delivery_type: order.deliveryType,
    vehicle_type: order.vehicleType,
    nf_numero: order.nfNumero,
    pickup_lat: order.pickupLat,
    pickup_long: order.pickupLong,
    dropoff_lat: order.dropoffLat,
    dropoff_long: order.dropoffLong,
    signature_name: order.signatureName,
    signature_image: order.signatureImage,
    received_user_image: order.receivedUserImage,
    pdf_url: order.pdfUrl,
    item_description: order.itemDescription,
    parcel_height: order.parcelHeight ?? null,
    parcel_width: order.parcelWidth ?? null,
    parcel_lenght: order.parcelLenght ?? null,
    parcel_weight: order.parcelWeight ?? null,
    dropoff_special_inst: order.dropoffSpecialInst,
    pickup_comapny_name: order.pickupComapnyName,
    dropoff_comapny_name: order.dropoffComapnyName,
    created_at: formatDateTime(order.createdAt),
    id_operacao: order.idOperacao,
  };
}
