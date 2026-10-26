import { ResolveReportStatusUseCase } from '../../../../src/features/report_problem/use-cases/resolve_report_status.use-case';
import type { RequireStatusUseCase } from '../../../../src/features/status/use-cases/require_status.use-case';
import { DeliveryStatus } from '../../../../src/core/shared/enums/delivery-status.enum';

describe('ResolveReportStatusUseCase', () => {
  it('marca o pedido com o status de problema', async () => {
    const requireStatus = {
      call: async () => ({ codigo: '9', microStatus: 'AUSENTE' }),
    } as unknown as RequireStatusUseCase;

    await expect(
      new ResolveReportStatusUseCase(requireStatus).call('AUSENTE'),
    ).resolves.toEqual({
      orderDeliveryStatus: DeliveryStatus.Legacy6,
      historicoStatusCodigo: '9',
      statusTexto: 'AUSENTE',
    });
  });

  it('propaga micro status inexistente', async () => {
    const requireStatus = {
      call: async () => {
        throw new Error('Status "SUMIU" não existe na tabela status');
      },
    } as unknown as RequireStatusUseCase;

    await expect(
      new ResolveReportStatusUseCase(requireStatus).call('SUMIU'),
    ).rejects.toThrow('não existe na tabela status');
  });
});
