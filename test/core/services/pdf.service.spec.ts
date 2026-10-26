import { describe, expect, it } from '@jest/globals';
import { PdfService } from '../../../src/core/services/pdf/pdf.service';

describe('PdfService', () => {
  const pdf = new PdfService();

  it('mantém o endereço inteiro, quebrando o que não cabe na linha', () => {
    const address =
      'Rua das Acacias Douradas do Bairro Jardim das Palmeiras Imperiais numero 1234 complemento bloco B apartamento 502';
    const content = pdf
      .buildFromLines([`Entrega: ${address}`])
      .toString('utf8');

    expect(content).toContain('Entrega:');
    expect(content).toContain('apartamento 502');
    expect(content.split(' Tj ET').length - 1).toBeGreaterThan(1);
  });

  it('deixa uma linha curta em um único texto', () => {
    const content = pdf.buildFromLines(['Pedido: 10']).toString('utf8');
    expect(content.split(' Tj ET').length - 1).toBe(1);
  });
});
