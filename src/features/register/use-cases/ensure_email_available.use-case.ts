import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterRepository } from '../repositories/register.repository';

@Injectable()
export class EnsureEmailAvailableUseCase {
  constructor(private readonly repository: RegisterRepository) {}

  async call(email: string) {
    const exists = await this.repository.findByEmail(email);
    if (exists) {
      throw new BadRequestException('E-mail inválido !');
    }
  }
}
