import { CreateDeliveryHistoricoUseCase } from '../../../../src/features/deliver_order/use-cases/create_delivery_historico.use-case';
import type { DeliverOrderRepository } from '../../../../src/features/deliver_order/repositories/deliver_order.repository';

describe('CreateDeliveryHistoricoUseCase', () => {
  it('grava o histórico da entrega', async () => {
    const calls: unknown[] = [];
    const repository = {
      createHistorico: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as DeliverOrderRepository;
    const input = { idEntrega: 4, ocorrencia: 'ENTREGUE' };

    await new CreateDeliveryHistoricoUseCase(repository).call(
      input as never,
    );
    expect(calls).toEqual([input]);
  });
});
