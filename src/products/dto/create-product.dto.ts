import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { CreateVariantDto } from './create-variant.dto';



class VariantDto {

  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  attribute: string; // Atributo (por ejemplo, 'Peso')

  @IsNotEmpty()
  @IsString()
  value: string; // Valor del atributo (por ejemplo, '1kg')

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

 
}




export class CreateProductDto {
  @IsString()
  title: string;

  // @IsNumber()
  // @IsPositive()
  // price: number;

  // @IsNumber()
  // @IsOptional()
  // @IsPositive()
  // priceCompare: number;

  @IsString()
  description: string;

  // @IsNumber()
  // @IsPositive()
  // stock: number;

  @IsString()
  slug:string;

  @IsNumber()
  subCategoryId: number;

  @IsNumber()
  @IsOptional()
  petId: number;


  @IsNumber()
  @IsOptional()
  brandId: number;

  @IsNumber()
  @IsOptional()
  discountId: number;

  @IsNumber()
  @IsOptional()
  providerId: number;



  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];


  @IsArray()
  @IsString({ each: true })
  images: string[];



}
