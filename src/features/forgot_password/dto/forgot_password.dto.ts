import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido !' })
  email!: string;
}
