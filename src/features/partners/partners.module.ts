import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { VersaoAtualUseCase } from './use-cases/versao_atual.use-case';
import { LocParceiroUseCase } from './use-cases/loc_parceiro.use-case';
import { PartnersRepository } from './repositories/partners.repository';

@Module({
  controllers: [PartnersController],
  providers: [VersaoAtualUseCase, LocParceiroUseCase, PartnersRepository],
})
export class PartnersModule {}
