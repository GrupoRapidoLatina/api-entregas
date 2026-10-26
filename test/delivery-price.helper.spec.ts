import {
  resolveDeliveryPrice,
  type DeliveryPriceTable,
} from '../src/core/helpers/delivery-price.helper';

const currentTable: DeliveryPriceTable = {
  m2hour: '3',
  m4hour: '.5',
  mSameday: '.5',
  c2hour: '3',
  c4hour: '1',
  cSameday: '1',
  v2hour: '1.50',
  v4hour: '1.5',
  vSameday: '1.5',
  t2hour: '2.00',
  t4hour: '2.00',
  tSameday: '2.00',
  pDMinCharge: '10',
};

describe('resolveDeliveryPrice', () => {
  it('sobe para o preço de 2 horas quando o prazo mais longo está mais barato e aplica o mínimo', () => {
    expect(resolveDeliveryPrice(currentTable, 'motorbike', '2HOUR')).toBe(
      '10.00',
    );
    expect(resolveDeliveryPrice(currentTable, 'motorbike', 'SAMEDAY')).toBe(
      '10.00',
    );
    expect(resolveDeliveryPrice(currentTable, 'bike', '4HOUR')).toBe('10.00');
    expect(resolveDeliveryPrice(currentTable, 'car', '4HOUR')).toBe('10.00');
    expect(resolveDeliveryPrice(currentTable, 'van', '2HOUR')).toBe('10.00');
    expect(resolveDeliveryPrice(currentTable, 'caminhao', 'SAMEDAY')).toBe(
      '10.00',
    );
  });

  it('usa a coluna do prazo quando ela é maior que a de 2 horas e que o mínimo', () => {
    const table: DeliveryPriceTable = {
      m2hour: '20',
      m4hour: '30',
      mSameday: '40',
      pDMinCharge: '10',
    };

    expect(resolveDeliveryPrice(table, 'moto', '2HOUR')).toBe('20.00');
    expect(resolveDeliveryPrice(table, 'moto', '4HOUR')).toBe('30.00');
    expect(resolveDeliveryPrice(table, 'moto', 'SAMEDAY')).toBe('40.00');
  });

  it('não cobra um prazo longo abaixo do preço de 2 horas', () => {
    const table: DeliveryPriceTable = {
      c2hour: '25',
      c4hour: '5',
      cSameday: '1',
      pDMinCharge: '10',
    };

    expect(resolveDeliveryPrice(table, 'carro', '4HOUR')).toBe('25.00');
    expect(resolveDeliveryPrice(table, 'carro', 'SAMEDAY')).toBe('25.00');
  });

  it('devolve nulo sem veículo ou sem preço configurado', () => {
    expect(resolveDeliveryPrice(currentTable, 'bicicleta', '2HOUR')).toBeNull();
    expect(
      resolveDeliveryPrice({ pDMinCharge: '10' }, 'motorbike', '2HOUR'),
    ).toBeNull();
  });
});
