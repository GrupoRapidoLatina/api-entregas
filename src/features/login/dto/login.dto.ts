import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido !' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'password é obrigatório' })
  password!: string;

  @IsString()
  @IsOptional()
  device_token?: string;

  @IsOptional()
  @IsIn(['ios', 'android'])
  device_type?: 'ios' | 'android';

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  longitude?: string;
}
