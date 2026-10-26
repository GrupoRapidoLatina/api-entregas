import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CancelDeliveryDto {
  @IsString()
  @IsNotEmpty({ message: 'order_id é obrigatório' })
  order_id!: string;

  @IsString()
  @IsOptional()
  user_id?: string;
}
