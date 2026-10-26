import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class NearbyDeliveriesDto {
  @IsString()
  @IsNotEmpty({ message: 'latitude é obrigatório' })
  @Matches(/^-?\d+(\.\d+)?$/, { message: 'latitude inválida' })
  latitude!: string;

  @IsString()
  @IsNotEmpty({ message: 'longitude é obrigatório' })
  @Matches(/^-?\d+(\.\d+)?$/, { message: 'longitude inválida' })
  longitude!: string;

  @IsString()
  @IsOptional()
  user_id?: string;
}
