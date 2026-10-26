import {
  isValidPlate,
  normalizePlate,
  normalizeVehicleType,
} from '../../../src/core/helpers/vehicle-plate.helper';

describe('placa e tipo de veículo', () => {
  it('normaliza apelidos de veículo para o tipo precificado', () => {
    expect(normalizeVehicleType(' moto ')).toBe('motorbike');
    expect(normalizeVehicleType('Carro')).toBe('car');
    expect(normalizeVehicleType('caminhão')).toBe('truck');
    expect(normalizeVehicleType('bicicleta')).toBe('bicicleta');
    expect(normalizeVehicleType(null)).toBe('');
  });

  it('aceita placa antiga e Mercosul depois de limpar a máscara', () => {
    expect(normalizePlate('abc-1d23')).toBe('ABC1D23');
    expect(isValidPlate('ABC-1234')).toBe(true);
    expect(isValidPlate('abc1d23')).toBe(true);
  });

  it('recusa placa incompleta ou vazia', () => {
    expect(isValidPlate('ABC123')).toBe(false);
    expect(isValidPlate('')).toBe(false);
    expect(isValidPlate(null)).toBe(false);
  });
});
