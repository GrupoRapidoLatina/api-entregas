import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangeReportProblemStatusDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'order_id é obrigatório' })
  order_id!: string;
}
