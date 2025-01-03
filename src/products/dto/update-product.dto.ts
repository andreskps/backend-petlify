import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsOptional()
    @IsBoolean()
    isPopular: boolean;

    @IsOptional()
    @IsBoolean()
    isNew:boolean

    @IsOptional()
    @IsBoolean()
    isLowStock:boolean
}
