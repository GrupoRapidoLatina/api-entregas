import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'order_id é obrigatório' })
  order_id!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customer_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  driver_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Avaliação inválida' })
  @Max(5, { message: 'Avaliação inválida' })
  driverRatting?: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
