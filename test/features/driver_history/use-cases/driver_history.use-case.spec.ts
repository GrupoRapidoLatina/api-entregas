import { DriverHistoryUseCase } from '../../../../src/features/driver_history/use-cases/driver_history.use-case';
import type { DriverHistoryRepository } from '../../../../src/features/driver_history/repositories/driver_history.repository';

describe('DriverHistoryUseCase', () => {
  it('devolve o histórico do motorista', async () => {
    const repository = {
      findHistory: async () => [{ id: 6, orderId: '6', driverId: 9 }],
    } as unknown as DriverHistoryRepository;

    const response = await new DriverHistoryUseCase(repository).call(9);
    expect(response.data?.[0]).toEqual(
      expect.objectContaining({ id: 6, driver_id: 9 }),
    );
  });

  it('devolve lista vazia sem histórico', async () => {
    const repository = {
      findHistory: async () => [],
    } as unknown as DriverHistoryRepository;

    await expect(new DriverHistoryUseCase(repository).call(9)).resolves.toEqual({
      success: true,
      data: [],
    });
  });
});
