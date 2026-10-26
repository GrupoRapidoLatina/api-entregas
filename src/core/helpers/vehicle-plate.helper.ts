const oldPlate = /^[A-Z]{3}\d{4}$/;
const mercosulPlate = /^[A-Z]{3}\d[A-Z]\d{2}$/;

const vehicleAliases: Record<string, string> = {
  motorbike: 'motorbike',
  moto: 'motorbike',
  bike: 'motorbike',
  car: 'car',
  carro: 'car',
  van: 'van',
  truck: 'truck',
  caminhao: 'truck',
  caminhão: 'truck',
};

export function normalizeVehicleType(value?: string | null): string {
  const key = (value ?? '').trim().toLowerCase();
  return vehicleAliases[key] ?? key;
}

export function normalizePlate(value?: string | null): string {
  return (value ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export function isValidPlate(value?: string | null): boolean {
  const plate = normalizePlate(value);
  return oldPlate.test(plate) || mercosulPlate.test(plate);
}
