import { RequireStatusUseCase } from '../../../../src/features/status/use-cases/require_status.use-case';
import type { StatusRepository } from '../../../../src/features/status/repositories/status.repository';

describe('RequireStatusUseCase', () => {
  it('devolve o status ativo pelo micro status', async () => {
    const repository = {
      findByMicroStatus: async (microStatus: string) =>
        microStatus === 'COLETA REALIZADA'
          ? { codigo: '2', microStatus: 'COLETA REALIZADA', ativo: 'S' }
          : null,
    } as unknown as StatusRepository;

    await expect(
      new RequireStatusUseCase(repository).call(' COLETA REALIZADA '),
    ).resolves.toEqual({
      codigo: '2',
      microStatus: 'COLETA REALIZADA',
      ativo: 'S',
    });
  });

  it('recusa micro status vazio ou inexistente', async () => {
    const repository = {
      findByMicroStatus: async () => null,
    } as unknown as StatusRepository;
    const useCase = new RequireStatusUseCase(repository);

    await expect(useCase.call('   ')).rejects.toThrow(
      'micro_status é obrigatório',
    );
    await expect(useCase.call('SUMIU')).rejects.toThrow(
      'Status "SUMIU" não existe na tabela status',
    );
  });
});
