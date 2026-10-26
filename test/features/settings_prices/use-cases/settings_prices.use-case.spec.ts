import { SettingsPricesUseCase } from '../../../../src/features/settings_prices/use-cases/settings_prices.use-case';
import type { SettingsPricesRepository } from '../../../../src/features/settings_prices/repositories/settings_prices.repository';

function useCase(setting: Record<string, string> | null) {
  const repository = {
    findPrices: async () => setting,
  } as unknown as SettingsPricesRepository;
  return new SettingsPricesUseCase(repository);
}

describe('SettingsPricesUseCase', () => {
  it('devolve o preço da coluna do veículo e do prazo', async () => {
    const response = await useCase({
      m2hour: '20',
      m4hour: '30',
      pDMinCharge: '10',
      driverPercentage: '15',
    }).call({ vehicle_type: 'moto', delivery_type: '4HOUR' });

    expect(response).toEqual({
      success: true,
      data: expect.objectContaining({
        price: '30.00',
        vehicle: { currency: 'BRL', admin_percentage: '15' },
      }),
    });
  });

  it('recusa quando não há tabela de preços', async () => {
    await expect(useCase(null).call({})).rejects.toThrow(
      'Sem dados disponíveis !',
    );
  });
});
