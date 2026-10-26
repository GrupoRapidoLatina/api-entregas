import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeliveryDetailDto {
  @IsString()
  @IsOptional()
  id_entrega?: string;

  @IsString()
  @IsOptional()
  delivery_id?: string;

  @IsString()
  @IsOptional()
  order_id?: string;
}
