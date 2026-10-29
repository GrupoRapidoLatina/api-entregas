import { ComprovanteValidadorStatus } from '../../../shared/enums/comprovante-validador-status.enum';

export type ValidadorPayload = {
  validacao_id: string;
  status: ComprovanteValidadorStatus;
  veredito?: string | null;
  motivos?: string[] | null;
};
