import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LocParceiroDto {
  @Transform(({ value }) => String(value ?? '').replace(/\D/g, ''))
  @IsString()
  @IsNotEmpty({ message: 'cnpj é obrigatório' })
  @Length(14, 14, { message: 'CNPJ inválido' })
  cnpj!: string;
}
