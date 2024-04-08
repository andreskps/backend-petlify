import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';



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

  @IsNumber()
  subCategoryId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

}
