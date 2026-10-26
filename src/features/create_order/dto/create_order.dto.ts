import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  pickup_comapny_name?: string;

  @IsString()
  @IsOptional()
  pickup_first_name?: string;

  @IsString()
  @IsOptional()
  pickup_last_name?: string;

  @IsString()
  @IsOptional()
  pickup_mob_number?: string;

  @IsString()
  @IsOptional()
  pickupaddress?: string;

  @IsString()
  @IsOptional()
  pickUpLat?: string;

  @IsString()
  @IsOptional()
  pickup_lat?: string;

  @IsString()
  @IsOptional()
  pickUpLong?: string;

  @IsString()
  @IsOptional()
  pickup_long?: string;

  @IsString()
  @IsOptional()
  item_description?: string;

  @IsString()
  @IsOptional()
  item_quantity?: string;

  @IsString()
  @IsOptional()
  delivery_date?: string;

  @IsString()
  @IsOptional()
  pickup_special_inst?: string;

  @IsString()
  @IsOptional()
  dropoff_first_name?: string;

  @IsString()
  @IsOptional()
  dropoff_last_name?: string;

  @IsString()
  @IsOptional()
  dropoff_mob_number?: string;

  @IsString()
  @IsOptional()
  dropoff_special_inst?: string;

  @IsString()
  @IsOptional()
  dropoffaddress?: string;

  @IsString()
  @IsOptional()
  dropOffLat?: string;

  @IsString()
  @IsOptional()
  dropoff_lat?: string;

  @IsString()
  @IsOptional()
  dropOffLong?: string;

  @IsString()
  @IsOptional()
  dropoff_long?: string;

  @IsString()
  @IsOptional()
  parcel_height?: string;

  @IsString()
  @IsOptional()
  parcel_width?: string;

  @IsString()
  @IsOptional()
  parcel_lenght?: string;

  @IsString()
  @IsOptional()
  parcel_weight?: string;

  @IsString()
  @IsOptional()
  delivery_distance?: string;

  @IsString()
  @IsOptional()
  delivery_cost?: string;

  @IsString()
  @IsOptional()
  vehicle_type?: string;

  @IsString()
  @IsOptional()
  delivery_type?: string;

  @IsString()
  @IsOptional()
  driver_delivery_cost?: string;

  @IsString()
  @IsOptional()
  dropoff_comapny_name?: string;

  @IsString()
  @IsOptional()
  delivery_time?: string;

  @IsString()
  @IsOptional()
  pickup_country_code?: string;

  @IsString()
  @IsOptional()
  dropoff_country_code?: string;
}
