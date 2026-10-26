import { CreateOrderUseCase } from '../../../../src/features/create_order/use-cases/create_order.use-case';
import type { CreateOrderDto } from '../../../../src/features/create_order/dto/create_order.dto';
import type { CreateOrderRepository } from '../../../../src/features/create_order/repositories/create_order.repository';
import type { FileUploadService } from '../../../../src/core/services/file-upload/file-upload.service';
import type { PdfService } from '../../../../src/core/services/pdf/pdf.service';

function build(user: { userId: number; idOperacao: number | null } | null) {
  const created: Array<Record<string, unknown>> = [];
  const repository = {
    findUser: async () => user,
    createOrder: async (data: Record<string, unknown>) => {
      created.push(data);
      return { id: 15, orderId: '15' };
    },
    updatePdfUrl: async () => ({}),
  } as unknown as CreateOrderRepository;
  const fileUpload = {
    uploadBuffer: async () => 'label_15.pdf',
  } as unknown as FileUploadService;
  const pdfService = {
    buildFromLines: () => Buffer.from('pdf'),
  } as unknown as PdfService;
  return {
    created,
    useCase: new CreateOrderUseCase(repository, fileUpload, pdfService),
  };
}

const dto = {
  pickupaddress: 'Rua A',
  dropoffaddress: 'Rua B',
  delivery_cost: '0.01',
  vehicle_type: 'motorbike',
  delivery_type: '4HOUR',
} as CreateOrderDto;

describe('CreateOrderUseCase', () => {
  it('grava o preço calculado e ignora o delivery_cost enviado pelo cliente', async () => {
    const { created, useCase } = build({ userId: 7, idOperacao: 3 });

    const response = await useCase.call(7, dto, '25.00');

    expect(created[0]?.deliveryCost).toBe('25.00');
    expect(created[0]?.deliveryCost).not.toBe(dto.delivery_cost);
    expect(response).toEqual({
      success: true,
      data: {
        order_id: '15',
        id: 15,
        pick: 'Rua A',
        drop: 'Rua B',
        pdf_url: expect.stringContaining('label_15.pdf'),
      },
    });
  });

  it('recusa usuário inexistente ou sem operação', async () => {
    await expect(build(null).useCase.call(7, dto, '25.00')).rejects.toThrow(
      'Usuário não encontrado',
    );
    await expect(
      build({ userId: 7, idOperacao: null }).useCase.call(7, dto, '25.00'),
    ).rejects.toThrow('id_operacao é obrigatório');
  });
});
