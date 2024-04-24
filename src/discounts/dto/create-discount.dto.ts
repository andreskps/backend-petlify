import { IsDecimal, IsString,IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  name: string;

  @IsNumber()
  percentage: number;

  @IsDate()
  @IsOptional()
  expiresAt: Date;

  @IsDate()
  @IsOptional()
  startsAt: Date;
}
