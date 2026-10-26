import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PickupDeliveryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'id é obrigatório' })
  id!: number;
}
