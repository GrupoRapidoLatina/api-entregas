import { PdfService } from '../../../core/services/pdf/pdf.service';
import type { LabelPdfInput } from '../types/label-pdf.input';

export function buildLabelPdf(
  pdfService: PdfService,
  input: LabelPdfInput,
): Buffer {
  return pdfService.buildFromLines([
    'RAPIDO ENTREGAS',
    `Pedido: ${input.orderId}`,
    `Tipo: ${input.deliveryType}`,
    `Data: ${input.deliveryDate} ${input.deliveryTime}`.trim(),
    `Coleta: ${input.pickup}`,
    `Entrega: ${input.dropoff}`,
  ]);
}
