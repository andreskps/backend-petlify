import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Req,
  Ip,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ValidRoles } from 'src/auth/enums/Validate-Roles.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request,@Ip() ip: string,){
    console.log(ip)
    return this.orderService.createOrder(createOrderDto, req,ip);
  }

  @Auth(ValidRoles.admin)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.orderService.findOne(+id);
  }

  @Get('status/:id')
  findByStatus(@Param('id', ParseIntPipe) id: string) {
    return this.orderService.findStatusOrder(+id);
  }

  @Auth(ValidRoles.admin)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
