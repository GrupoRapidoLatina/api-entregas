import { DeliveryDetailUseCase } from '../../../../src/features/delivery_detail/use-cases/delivery_detail.use-case';
import type { DeliveryDetailRepository } from '../../../../src/features/delivery_detail/repositories/delivery_detail.repository';

function useCase(
  found: Record<string, unknown> | null,
  report: Record<string, unknown> | null = null,
) {
  const repository = {
    findById: async (id: number) => (id === 4 ? found : null),
    findByOrderId: async (orderId: string) =>
      orderId === 'ABC' ? found : null,
    findLatestReportByEntregaId: async () => report,
  } as unknown as DeliveryDetailRepository;
  return new DeliveryDetailUseCase(repository);
}

describe('DeliveryDetailUseCase', () => {
  it('devolve o pedido pelo id numérico', async () => {
    const response = await useCase({
      id: 4,
      orderId: '4',
      deliveryCost: '20.00',
    }).call({ id_entrega: '4' });

    expect(response.data).toEqual({
      deliverydata: expect.objectContaining({
        id: 4,
        order_id: '4',
        delivery_cost: '20.00',
        driver_report: null,
      }),
    });
  });

  it('inclui o report do motorista quando existir', async () => {
    const response = await useCase(
      { id: 4, orderId: '4', deliveryCost: '20.00' },
      {
        message: 'DESTINATÁRIO AUSENTE',
        comment: 'Ninguém atendeu o interfone',
        imagem: 'foto.jpg',
      },
    ).call({ id_entrega: '4' });

    expect(response.data).toEqual({
      deliverydata: expect.objectContaining({
        id: 4,
        driver_report: {
          message: 'DESTINATÁRIO AUSENTE',
          comment: 'Ninguém atendeu o interfone',
          imagem: 'foto.jpg',
        },
      }),
    });
  });

  it('recusa identificador ausente ou pedido inexistente', async () => {
    await expect(useCase(null).call({})).rejects.toThrow(
      'Please enter valid user id !',
    );
    await expect(useCase(null).call({ order_id: 'sumiu' })).rejects.toThrow(
      'Please enter valid user id !',
    );
  });
});
