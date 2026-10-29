import { ComprovanteService } from '../../../../src/core/services/comprovante/comprovante.service';

describe('ComprovanteService', () => {
  const service = new ComprovanteService();

  beforeAll(() => {
    process.env.COMPROVANTE_HMAC_SECRET = 'teste-hmac-comprovante';
  });

  it('assina e valida o payload da conferência', () => {
    const assinatura = service.sign(123, 'abc', 'val_1');
    expect(assinatura).toHaveLength(64);
    expect(service.isValidAssinatura(123, 'abc', 'val_1', assinatura)).toBe(
      true,
    );
  });

  it('recusa assinatura de outra entrega ou foto', () => {
    const assinatura = service.sign(123, 'abc', 'val_1');
    expect(service.isValidAssinatura(999, 'abc', 'val_1', assinatura)).toBe(
      false,
    );
    expect(service.isValidAssinatura(123, 'zzz', 'val_1', assinatura)).toBe(
      false,
    );
    expect(service.isValidAssinatura(123, 'abc', 'val_2', assinatura)).toBe(
      false,
    );
    expect(service.isValidAssinatura(123, 'abc', 'val_1', '')).toBe(false);
  });

  it('permite até 20 conferências por minuto por origem', () => {
    for (let i = 0; i < 20; i += 1) {
      expect(service.tryConsumeRateLimit('user:1')).toBe(true);
    }
    expect(service.tryConsumeRateLimit('user:1')).toBe(false);
    expect(service.tryConsumeRateLimit('user:2')).toBe(true);
  });
});
