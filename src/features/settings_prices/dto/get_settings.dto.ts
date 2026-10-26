import { IsOptional, IsString } from 'class-validator';

export class GetSettingsDto {
  @IsString()
  @IsOptional()
  vehicle_type?: string;

  @IsString()
  @IsOptional()
  delivery_type?: string;
}
