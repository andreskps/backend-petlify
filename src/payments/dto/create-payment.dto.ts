import { IsInt } from "class-validator";

export class CreatePaymentDto {

  @IsInt()
   idOrder: number;


}
