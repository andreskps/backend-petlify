import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class subcategoryDto {
  @IsString()
  name: string;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => subcategoryDto)
  subcategories: subcategoryDto[];
}
