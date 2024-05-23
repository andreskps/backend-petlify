import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../enums/orderStatus.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsString()
  @IsIn([
    'procesando',
    'confirmado',
    'enviado',
    'entregado',
    'cancelado',
    'devuelto',
  ])
  orderStatus: string;
}
