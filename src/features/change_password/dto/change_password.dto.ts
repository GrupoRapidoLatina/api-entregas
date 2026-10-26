import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'old_password é obrigatório' })
  old_password!: string;

  @IsString()
  @IsNotEmpty({ message: 'new_password é obrigatório' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  new_password!: string;
}
