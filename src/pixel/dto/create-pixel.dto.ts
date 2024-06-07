import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserData {
  // @IsNotEmpty()
  // @IsString()
  // client_ip_address: string;

  // @IsNotEmpty()
  // @IsString()
  // client_user_agent: string;
  @IsOptional()
  @IsString()
  fbp: string;

  @IsOptional()
  @IsString()
  fbc: string;
}

class CustomData {
  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  content_name: string;

  @IsArray()
  content_ids: string[];
}

export class AddToCartDto {
  @IsNotEmpty()
  event_id: string;

  // @IsNotEmpty()
  // @IsString()
  // event_name: string;

  @IsNotEmpty()
  @IsNumber()
  event_time: number;

  @ValidateNested()
  @Type(() => UserData)
  user_data: UserData;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomData)
  custom_data: CustomData;

  // @IsNotEmpty()
  // @IsString()
  // test_event_code: string;
}

export class EventViewContentDto {
  @IsNotEmpty()
  event_id: string;

  @IsNotEmpty()
  @IsNumber()
  event_time: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomData)
  custom_data: CustomData;

  @ValidateNested()
  @Type(() => UserData)
  user_data: UserData;
}

export class EventInitiateCheckoutDto {
  @IsNotEmpty()
  event_id: string;

  // @IsNotEmpty()
  // @IsString()
  // event_name: string;

  @IsNotEmpty()
  @IsNumber()
  event_time: number;

  @ValidateNested()
  @Type(() => UserData)
  user_data: UserData;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomData)
  custom_data: CustomData;

  // @IsNotEmpty()
  // @IsString()
  // test_event_code: string;
}
