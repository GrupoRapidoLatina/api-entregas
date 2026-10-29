import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ValidarComprovanteDto {
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'id é obrigatório' })
  id!: number;
}
