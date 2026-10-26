import { IsOptional, IsString } from 'class-validator';

export class ListStatusDto {
  @IsString()
  @IsOptional()
  tipo?: string;
}
