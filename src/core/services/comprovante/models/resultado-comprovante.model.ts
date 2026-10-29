import { ComprovanteVeredito } from '../../../shared/enums/comprovante-veredito.enum';

export type ResultadoComprovante = {
  validacaoId: string;
  veredito: ComprovanteVeredito;
  motivos: string[];
  tempoMs: number;
};
