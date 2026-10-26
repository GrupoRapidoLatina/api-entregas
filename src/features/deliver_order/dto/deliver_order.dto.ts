import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeliverOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'id é obrigatório' })
  id!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @IsString()
  @IsOptional()
  signature_name?: string;

  @IsString()
  @IsOptional()
  latitude_foto?: string;

  @IsString()
  @IsOptional()
  longitude_foto?: string;

  @IsString()
  @IsNotEmpty({ message: 'status_entregue é obrigatório' })
  status_entregue!: string;

  @IsString()
  @IsOptional()
  signature_image?: string;

  @IsString()
  @IsOptional()
  received_user_image?: string;
}
