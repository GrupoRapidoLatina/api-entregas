import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '../../../core/shared/enums/user-type.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'email é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido !' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'password é obrigatório' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(UserType)
  user_type?: UserType;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  vehicle_type?: string;

  @IsString()
  @IsOptional()
  device_token?: string;

  @IsString()
  @IsOptional()
  house_no?: string;

  @IsString()
  @IsOptional()
  country_code?: string;

  @IsString()
  @IsOptional()
  street_name?: string;

  @IsString()
  @IsOptional()
  country_name?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  social_type?: string;

  @IsString()
  @IsOptional()
  social_id?: string;

  @IsString()
  @IsOptional()
  postcode?: string;

  @IsString()
  @IsOptional()
  suburb?: string;

  @IsString()
  @IsOptional()
  company_name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_parceiro?: number;

  @IsString()
  @IsOptional()
  vehicle_reg_no?: string;

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
