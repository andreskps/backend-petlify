import { IsOptional, IsIn } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsIn(['isPopular', 'isNew'])
  filter: string;

  //   @IsOptional()
  //   sort: string;

  @IsOptional()
  subcategory: string;


  @IsOptional()
  pet: string;



  @IsOptional()
  brand: string;
}
