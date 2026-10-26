import { LocParceiroUseCase } from '../../../../src/features/partners/use-cases/loc_parceiro.use-case';
import type { PartnersRepository } from '../../../../src/features/partners/repositories/partners.repository';

describe('LocParceiroUseCase', () => {
  it('devolve o último parceiro ativo do CNPJ', async () => {
    const repository = {
      findActiveByCnpj: async (cnpj: string) =>
        cnpj === '12345678000190'
          ? [
              { codigo: 1, razao: 'Antiga', cgc: cnpj },
              { codigo: 2, razao: 'Atual', cgc: cnpj },
            ]
          : [],
    } as unknown as PartnersRepository;

    await expect(
      new LocParceiroUseCase(repository).call({
        cnpj: '12.345.678/0001-90',
      }),
    ).resolves.toEqual({
      success: true,
      data: [{ codigo: 2, razao: 'Atual', cgc: '12345678000190' }],
    });
  });

  it('recusa CNPJ sem parceiro ativo', async () => {
    const repository = {
      findActiveByCnpj: async () => [],
    } as unknown as PartnersRepository;

    await expect(
      new LocParceiroUseCase(repository).call({ cnpj: '00000000000000' }),
    ).rejects.toThrow('Parceiro não encontrado');
  });
});
