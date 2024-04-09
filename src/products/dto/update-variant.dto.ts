import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateVariantDto } from "./create-variant.dto";

export class UpdateVariantDto extends PartialType(CreateVariantDto) {
    
}