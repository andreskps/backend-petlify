import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class VariantsDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsInt()
  quantity: number;
}

class AddressDto {
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  neighborhood: string;

  @IsOptional()
  @IsString()
  addressDetail: string;

  @IsInt()
  municipioId: number;
}

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  namePet: string;

  @IsString()
  paymentMethod: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantsDto)
  variants: VariantsDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsString()
  coupon: string;
}
