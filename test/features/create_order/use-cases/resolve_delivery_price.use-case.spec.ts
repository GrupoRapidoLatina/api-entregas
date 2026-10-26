import { ResolveDeliveryPriceUseCase } from '../../../../src/features/create_order/use-cases/resolve_delivery_price.use-case';
import type { CreateOrderRepository } from '../../../../src/features/create_order/repositories/create_order.repository';

function useCase(setting: Record<string, string> | null) {
  const repository = {
    findPrices: async () => setting,
  } as unknown as CreateOrderRepository;
  return new ResolveDeliveryPriceUseCase(repository);
}

describe('ResolveDeliveryPriceUseCase', () => {
  it('usa a coluna do veículo e do prazo e aplica o mínimo', async () => {
    const price = await useCase({
      m2hour: '8',
      m4hour: '12',
      pDMinCharge: '10',
    }).call('moto', '2HOUR');

    expect(price).toBe('10.00');
  });

  it('não deixa o prazo longo ficar mais barato que 2 horas', async () => {
    const price = await useCase({
      c2hour: '25',
      c4hour: '5',
      cSameday: '1',
      pDMinCharge: '10',
    }).call('carro', 'SAMEDAY');

    expect(price).toBe('25.00');
  });

  it('recusa quando o preço não está configurado', async () => {
    await expect(useCase(null).call('motorbike', '2HOUR')).rejects.toThrow(
      'Preço da corrida não configurado',
    );
    await expect(
      useCase({ pDMinCharge: '10' }).call('motorbike', '2HOUR'),
    ).rejects.toThrow('Preço da corrida não configurado');
  });
});
