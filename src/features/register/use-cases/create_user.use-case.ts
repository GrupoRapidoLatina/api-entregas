import { Injectable } from '@nestjs/common';
import { RegisterRepository } from '../repositories/register.repository';
import type { CreateUserInput } from '../models/create-user.input';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: RegisterRepository) {}

  call(data: CreateUserInput) {
    return this.repository.createUser(data);
  }
}
