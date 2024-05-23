import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsNumber()
  percentage: number;

  @IsOptional()
  @IsNumber()
  minimumAmount: number;

  @IsOptional()
  @IsDate()
  expiresAt: Date;

  @IsOptional()
  @IsDate()
  startsAt: Date;
}
