import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterImagesDto {
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'user_id é obrigatório' })
  user_id!: number;

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  @IsOptional()
  licence_front_image?: string;

  @IsString()
  @IsOptional()
  licence_back_image?: string;
}
