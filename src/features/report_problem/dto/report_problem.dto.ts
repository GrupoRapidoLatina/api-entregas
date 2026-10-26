import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportProblemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  delivery_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @IsString()
  @IsOptional()
  order_id?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  message?: string;

  /** Alias do app (legado usa `message`). */
  @IsString()
  @IsOptional()
  problem?: string;

  @IsString()
  @IsOptional()
  lat?: string;

  @IsString()
  @IsOptional()
  lon?: string;

  @IsString()
  @IsOptional()
  image_path?: string;

  @IsString()
  @IsOptional()
  nfnumero?: string;
}
