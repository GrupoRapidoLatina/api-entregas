import { Injectable } from '@nestjs/common';
import { ReportProblemRepository } from '../repositories/report_problem.repository';

@Injectable()
export class FindCustomerUseCase {
  constructor(private readonly repository: ReportProblemRepository) {}

  call(userId: number) {
    return this.repository.findUser(userId);
  }
}
