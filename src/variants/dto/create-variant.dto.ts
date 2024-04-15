import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateVariantDto{
  
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

    @IsUUID()
    productId: string;
  
}