import { Module } from '@nestjs/common';
import { ValidarComprovanteController } from './validar_comprovante.controller';
import { ValidarComprovanteRepository } from './repositories/validar_comprovante.repository';
import { AssinarComprovanteUseCase } from './use-cases/assinar_comprovante.use-case';
import { FindOrderUseCase } from './use-cases/find_order.use-case';
import { ValidarComprovanteUseCase } from './use-cases/validar_comprovante.use-case';

@Module({
  controllers: [ValidarComprovanteController],
  providers: [
    ValidarComprovanteRepository,
    FindOrderUseCase,
    ValidarComprovanteUseCase,
    AssinarComprovanteUseCase,
  ],
})
export class ValidarComprovanteModule {}
