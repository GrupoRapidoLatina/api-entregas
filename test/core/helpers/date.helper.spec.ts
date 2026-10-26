import {
  formatDateOnly,
  formatDateTime,
  parseOptionalDate,
} from '../../../src/core/helpers/date.helper';

describe('datas', () => {
  it('interpreta data simples no calendário local e ISO válido', () => {
    const day = parseOptionalDate('2026-09-30');
    expect(day).not.toBeNull();
    expect(day!.getFullYear()).toBe(2026);
    expect(day!.getMonth()).toBe(8);
    expect(day!.getDate()).toBe(30);

    const instant = parseOptionalDate('2026-09-30T15:04:05.000Z');
    expect(instant?.toISOString()).toBe('2026-09-30T15:04:05.000Z');
  });

  it('devolve nulo para vazio ou texto inválido', () => {
    expect(parseOptionalDate('')).toBeNull();
    expect(parseOptionalDate('   ')).toBeNull();
    expect(parseOptionalDate(null)).toBeNull();
    expect(parseOptionalDate('nao-e-data')).toBeNull();
  });

  it('formata data e hora e preserva texto que não é data', () => {
    const instant = new Date('2026-09-30T15:04:05.000Z');
    expect(formatDateOnly(instant)).toBe('2026-09-30');
    expect(formatDateTime(instant)).toBe('2026-09-30 15:04:05');
    expect(formatDateOnly('')).toBeNull();
    expect(formatDateTime(null)).toBeNull();
    expect(formatDateTime('amanhã')).toBe('amanhã');
    expect(formatDateOnly('nao-e-data')).toBe('nao-e-data');
  });
});
