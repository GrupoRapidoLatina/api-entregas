import { ResolveDeliveryStatusUseCase } from '../../../../src/features/deliver_order/use-cases/resolve_delivery_status.use-case';
import type { RequireStatusUseCase } from '../../../../src/features/status/use-cases/require_status.use-case';
import { DeliveryStatus } from '../../../../src/core/shared/enums/delivery-status.enum';

describe('ResolveDeliveryStatusUseCase', () => {
  it('marca a entrega como entregue com o código do micro status', async () => {
    const requireStatus = {
      call: async () => ({ codigo: '4', microStatus: 'ENTREGUE' }),
    } as unknown as RequireStatusUseCase;

    await expect(
      new ResolveDeliveryStatusUseCase(requireStatus).call('ENTREGUE'),
    ).resolves.toEqual({
      orderDeliveryStatus: DeliveryStatus.Delivered,
      historicoStatusCodigo: '4',
      statusTexto: 'ENTREGUE',
    });
  });

  it('propaga status inexistente', async () => {
    const requireStatus = {
      call: async () => {
        throw new Error('Status "SUMIU" não existe na tabela status');
      },
    } as unknown as RequireStatusUseCase;

    await expect(
      new ResolveDeliveryStatusUseCase(requireStatus).call('SUMIU'),
    ).rejects.toThrow('não existe na tabela status');
  });
});
