import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateBrandDto {
     
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    logo: string;
}
