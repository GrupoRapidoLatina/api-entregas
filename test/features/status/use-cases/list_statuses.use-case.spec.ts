import { ListStatusesUseCase } from '../../../../src/features/status/use-cases/list_statuses.use-case';
import type { StatusRepository } from '../../../../src/features/status/repositories/status.repository';

describe('ListStatusesUseCase', () => {
  it('lista os status ativos e, no tipo problema, só as falhas', async () => {
    const repository = {
      findActive: async () => [
        {
          codigo: '1',
          macroStatus: 'ENTREGA',
          microStatus: 'COLETA REALIZADA',
          ativo: 'S',
          finalizador: 'N',
        },
      ],
      findActiveProblems: async () => [
        {
          codigo: '9',
          macroStatus: 'FALHA NA ENTREGA',
          microStatus: 'AUSENTE',
          ativo: 'S',
          finalizador: 'S',
        },
      ],
    } as unknown as StatusRepository;
    const useCase = new ListStatusesUseCase(repository);

    await expect(useCase.call()).resolves.toEqual({
      success: true,
      data: [
        {
          codigo: '1',
          macro_status: 'ENTREGA',
          micro_status: 'COLETA REALIZADA',
          ativo: 'S',
          finalizador: 'N',
        },
      ],
    });
    const problems = await useCase.call('problema');
    expect(problems.data).toEqual([
      expect.objectContaining({ micro_status: 'AUSENTE' }),
    ]);
  });

  it('recusa quando não há status', async () => {
    const repository = {
      findActive: async () => [],
      findActiveProblems: async () => [],
    } as unknown as StatusRepository;

    await expect(new ListStatusesUseCase(repository).call()).rejects.toThrow(
      'Nenhum status disponível',
    );
  });
});
