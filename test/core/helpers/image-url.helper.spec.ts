import { imageUrl } from '../../../src/core/helpers/image-url.helper';

describe('imageUrl', () => {
  const previous = process.env.IMAGE_BASE_URL;

  afterEach(() => {
    if (previous === undefined) delete process.env.IMAGE_BASE_URL;
    else process.env.IMAGE_BASE_URL = previous;
  });

  it('prefixa o arquivo com a base configurada', () => {
    process.env.IMAGE_BASE_URL = 'https://cdn.test/';
    expect(imageUrl('ana.jpg')).toBe('https://cdn.test/ana.jpg');
  });

  it('mantém URL absoluta e devolve vazio sem arquivo', () => {
    process.env.IMAGE_BASE_URL = 'https://cdn.test/';
    expect(imageUrl('https://outro/ana.jpg')).toBe('https://outro/ana.jpg');
    expect(imageUrl('')).toBe('');
    expect(imageUrl(null)).toBe('');
  });
});
