import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class EditProfileDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'E-mail inválido !' })
  @IsEmail({}, { message: 'E-mail inválido !' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  phone?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  vehicleType?: string;

  @IsString()
  @IsOptional()
  vehicle_type?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  company_name?: string;

  @IsString()
  @IsOptional()
  suburb?: string;

  @IsString()
  @IsOptional()
  postcode?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  countryName?: string;

  @IsString()
  @IsOptional()
  country_name?: string;

  @IsString()
  @IsOptional()
  streetName?: string;

  @IsString()
  @IsOptional()
  street_name?: string;

  @IsString()
  @IsOptional()
  houseNo?: string;

  @IsString()
  @IsOptional()
  house_no?: string;

  @IsString()
  @IsOptional()
  vehicleRegNo?: string;

  @IsString()
  @IsOptional()
  vehicle_reg_no?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsOptional()
  country_code?: string;

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
