export type CreateDeliveryHistoricoInput = {
  idEntrega: number;
  idOperacao: number;
  idUsuario: number;
  idMotorista?: number | null;
  idStatus: number;
  dataOco: Date | string;
  dataCad?: Date | string;
  ocorrencia: string;
  obs?: string | null;
  lat?: string | null;
  lon?: string | null;
  clientImage?: string | null;
  signatureImage?: string | null;
};
