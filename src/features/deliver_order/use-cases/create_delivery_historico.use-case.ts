import { Injectable } from '@nestjs/common';
import type { CreateDeliveryHistoricoInput } from '../models/create-delivery-historico.input';
import { DeliverOrderRepository } from '../repositories/deliver_order.repository';

@Injectable()
export class CreateDeliveryHistoricoUseCase {
  constructor(private readonly repository: DeliverOrderRepository) {}

  call(input: CreateDeliveryHistoricoInput) {
    const { clientImage, signatureImage, ...historico } = input;
    const imagem = clientImage || signatureImage || undefined;
    return this.repository.createHistorico({
      ...historico,
      ...(imagem ? { imagem } : {}),
    });
  }
}
