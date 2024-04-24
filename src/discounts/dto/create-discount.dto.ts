import { IsDecimal, IsString,IsDate, IsNumber } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  name: string;

  @IsNumber()
  percentage: number;

  @IsDate()
  expiresAt: Date;

  @IsDate()
  startsAt: Date;
}
