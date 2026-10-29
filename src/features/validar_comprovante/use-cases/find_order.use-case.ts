import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidarComprovanteRepository } from '../repositories/validar_comprovante.repository';

@Injectable()
export class FindOrderUseCase {
  constructor(private readonly repository: ValidarComprovanteRepository) {}

  async call(id: number) {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }
}
