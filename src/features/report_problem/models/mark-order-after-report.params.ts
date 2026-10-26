import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';

export type MarkOrderAfterReportParams = {
  deliveryStatus: DeliveryStatus;
  insucessoLat: string;
  insucessoLon: string;
  updateLat: string;
  updateLon: string;
};
