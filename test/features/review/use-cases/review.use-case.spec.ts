import { ReviewUseCase } from '../../../../src/features/review/use-cases/review.use-case';
import type { ReviewRepository } from '../../../../src/features/review/repositories/review.repository';

describe('ReviewUseCase', () => {
  it('grava nota e comentário como texto', async () => {
    const calls: unknown[] = [];
    const repository = {
      createReview: async (data: unknown) => {
        calls.push(data);
      },
    } as unknown as ReviewRepository;

    await expect(
      new ReviewUseCase(repository).call({
        order_id: 4,
        customer_id: 7,
        driver_id: 8,
        driverRatting: 5,
        feedback: 'ótima',
      }),
    ).resolves.toEqual({ success: true });
    expect(calls).toEqual([
      {
        orderId: 4,
        customerId: 7,
        driverId: 8,
        driverRatting: '5',
        feedback: 'ótima',
        message: 'ótima',
        serviceRatting: '5',
      },
    ]);
  });

  it('usa zero quando a nota não vem no pedido', async () => {
    const calls: Array<{ driverRatting: string }> = [];
    const repository = {
      createReview: async (data: { driverRatting: string }) => {
        calls.push(data);
      },
    } as unknown as ReviewRepository;

    await new ReviewUseCase(repository).call({ order_id: 4 });
    expect(calls[0]?.driverRatting).toBe('0');
  });
});
