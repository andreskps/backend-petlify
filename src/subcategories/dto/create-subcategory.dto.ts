import { IsNumber, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  name: string;

  @IsNumber()
  categoryId: number;
}
