import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportProblemRepository } from '../repositories/report_problem.repository';

@Injectable()
export class FindOrderUseCase {
  constructor(private readonly repository: ReportProblemRepository) {}

  async call(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }
}
