export type UploadComprovanteInput = {
  imageBuffer: Buffer;
  orderId: number;
  nfNumero?: string | null;
  mimeType?: string;
  originalFileName?: string;
};
