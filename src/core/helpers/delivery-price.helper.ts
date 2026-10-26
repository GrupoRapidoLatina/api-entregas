import { DeliveryWindow } from '../shared/enums/delivery-window.enum';
import { PricedVehicle } from '../shared/enums/priced-vehicle.enum';
import { normalizeVehicleType } from './vehicle-plate.helper';

export type DeliveryPriceTable = {
  m2hour?: string | null;
  m4hour?: string | null;
  mSameday?: string | null;
  c2hour?: string | null;
  c4hour?: string | null;
  cSameday?: string | null;
  v2hour?: string | null;
  v4hour?: string | null;
  vSameday?: string | null;
  t2hour?: string | null;
  t4hour?: string | null;
  tSameday?: string | null;
  pDMinCharge?: string | null;
};

const columns: Record<
  PricedVehicle,
  Record<DeliveryWindow, keyof DeliveryPriceTable>
> = {
  [PricedVehicle.Motorbike]: {
    [DeliveryWindow.TwoHour]: 'm2hour',
    [DeliveryWindow.FourHour]: 'm4hour',
    [DeliveryWindow.SameDay]: 'mSameday',
  },
  [PricedVehicle.Car]: {
    [DeliveryWindow.TwoHour]: 'c2hour',
    [DeliveryWindow.FourHour]: 'c4hour',
    [DeliveryWindow.SameDay]: 'cSameday',
  },
  [PricedVehicle.Van]: {
    [DeliveryWindow.TwoHour]: 'v2hour',
    [DeliveryWindow.FourHour]: 'v4hour',
    [DeliveryWindow.SameDay]: 'vSameday',
  },
  [PricedVehicle.Truck]: {
    [DeliveryWindow.TwoHour]: 't2hour',
    [DeliveryWindow.FourHour]: 't4hour',
    [DeliveryWindow.SameDay]: 'tSameday',
  },
};

export function resolveDeliveryPrice(
  table: DeliveryPriceTable,
  vehicleType?: string | null,
  deliveryType?: string | null,
): string | null {
  const vehicle = asPricedVehicle(vehicleType);
  if (!vehicle) return null;

  const deliveryWindow = normalizeDeliveryWindow(deliveryType);
  const twoHour = parseAmount(table[columns[vehicle][DeliveryWindow.TwoHour]]);
  const selected =
    deliveryWindow === DeliveryWindow.TwoHour
      ? twoHour
      : parseAmount(table[columns[vehicle][deliveryWindow]]);
  const checked =
    selected == null || (twoHour != null && selected < twoHour)
      ? twoHour
      : selected;
  if (checked == null) return null;

  const minimum = parseAmount(table.pDMinCharge);
  const price = minimum != null && checked < minimum ? minimum : checked;
  return formatAmount(price);
}

export function normalizeDeliveryWindow(value?: string | null): DeliveryWindow {
  const key = (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '');
  if (key === '4hour' || key === '4h') return DeliveryWindow.FourHour;
  if (key === 'sameday' || key === 'mesmodia') return DeliveryWindow.SameDay;
  return DeliveryWindow.TwoHour;
}

export function asPricedVehicle(value?: string | null): PricedVehicle | null {
  const vehicle = normalizeVehicleType(value);
  const priced = Object.values(PricedVehicle);
  if (priced.includes(vehicle as PricedVehicle)) {
    return vehicle as PricedVehicle;
  }
  return null;
}

export function parseAmount(value?: string | null): number | null {
  const normalized = (value ?? '').trim().replace(',', '.');
  if (!normalized) return null;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return amount;
}

export function formatAmount(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}
