import { CreatePickupHistoricoUseCase } from '../../../../src/features/pickup_delivery/use-cases/create_pickup_historico.use-case';
import type { PickupDeliveryRepository } from '../../../../src/features/pickup_delivery/repositories/pickup_delivery.repository';

describe('CreatePickupHistoricoUseCase', () => {
  it('grava o histórico da coleta', async () => {
    const calls: unknown[] = [];
    const repository = {
      createHistorico: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as PickupDeliveryRepository;

    await new CreatePickupHistoricoUseCase(repository).call({
      idEntrega: 4,
      ocorrencia: 'COLETA REALIZADA',
    } as never);
    expect(calls).toEqual([
      { idEntrega: 4, ocorrencia: 'COLETA REALIZADA' },
    ]);
  });
});
