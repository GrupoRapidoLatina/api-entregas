import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class NearbyDeliveryBoysDto {
  @IsString()
  @IsNotEmpty({ message: 'latitude é obrigatório' })
  @Matches(/^-?\d+(\.\d+)?$/, { message: 'latitude inválida' })
  latitude!: string;

  @IsString()
  @IsNotEmpty({ message: 'longitude é obrigatório' })
  @Matches(/^-?\d+(\.\d+)?$/, { message: 'longitude inválida' })
  longitude!: string;
}
