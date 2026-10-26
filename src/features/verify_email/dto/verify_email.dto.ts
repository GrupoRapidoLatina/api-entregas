import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty({ message: 'email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido !' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'code é obrigatório' })
  @Matches(/^\d{1,6}$/, { message: 'Código de verificação inválido' })
  code!: string;
}
