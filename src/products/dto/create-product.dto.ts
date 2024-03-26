import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  priceCompare: number;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsNumber()
  subCategoryId: number;
}
