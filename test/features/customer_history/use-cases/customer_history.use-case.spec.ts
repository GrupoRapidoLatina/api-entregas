import { CustomerHistoryUseCase } from '../../../../src/features/customer_history/use-cases/customer_history.use-case';
import type { CustomerHistoryRepository } from '../../../../src/features/customer_history/repositories/customer_history.repository';

describe('CustomerHistoryUseCase', () => {
  it('devolve o histórico do cliente', async () => {
    const repository = {
      findHistory: async (userId: number) =>
        userId === 7 ? [{ id: 3, orderId: '3', deliveryStatus: 4 }] : [],
    } as unknown as CustomerHistoryRepository;

    const response = await new CustomerHistoryUseCase(repository).call(7);
    expect(response.data).toEqual([
      expect.objectContaining({ id: 3, order_id: '3', delivery_status: 4 }),
    ]);
  });

  it('devolve lista vazia sem histórico', async () => {
    const repository = {
      findHistory: async () => [],
    } as unknown as CustomerHistoryRepository;

    await expect(new CustomerHistoryUseCase(repository).call(7)).resolves.toEqual({
      success: true,
      data: [],
    });
  });
});
