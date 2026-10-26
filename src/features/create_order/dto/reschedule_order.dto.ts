import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RescheduleOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'order_id é obrigatório' })
  order_id!: string;

  @IsString()
  @IsOptional()
  delivery_date?: string;

  @IsString()
  @IsOptional()
  delivery_time?: string;
}
