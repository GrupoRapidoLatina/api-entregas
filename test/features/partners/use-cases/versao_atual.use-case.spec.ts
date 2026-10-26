import { VersaoAtualUseCase } from '../../../../src/features/partners/use-cases/versao_atual.use-case';

describe('VersaoAtualUseCase', () => {
  const previous = process.env.APP_VERSION;

  afterEach(() => {
    if (previous === undefined) delete process.env.APP_VERSION;
    else process.env.APP_VERSION = previous;
  });

  it('devolve a versão configurada', async () => {
    process.env.APP_VERSION = '2.4.0';
    await expect(new VersaoAtualUseCase().call()).resolves.toEqual({
      success: true,
      data: '2.4.0',
    });
  });

  it('confirma sucesso quando a versão não está configurada', async () => {
    delete process.env.APP_VERSION;
    await expect(new VersaoAtualUseCase().call()).resolves.toEqual({
      success: true,
    });
  });
});
