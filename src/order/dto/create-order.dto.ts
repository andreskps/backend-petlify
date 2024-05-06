import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateVariantDto {
  id: number;
  quantity: number;
}

class AddressDto {
  name: string;
  lastName: string;
  address: string;
  neighborhood: string;
  addressDetail: string;
  phone: string;
  municipioId: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];

  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsString()
  coupon: string;
}
