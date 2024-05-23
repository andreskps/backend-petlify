import { IsOptional, IsIn, IsNumber } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsIn(['isPopular', 'isNew'])
  filter: string;

  //   @IsOptional()
  //   sort: string;

  @IsOptional()
  category: string;
  
  @IsOptional()
  subcategory: string;

  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;



  @IsOptional()
  pet: string;



  @IsOptional()
  brand: string;
}
