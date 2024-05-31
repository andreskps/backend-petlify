import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Ip,
} from '@nestjs/common';
import { PixelService } from './pixel.service';
import { AddToCartDto } from './dto/create-pixel.dto';

import { Request } from 'express';

@Controller('pixel')
export class PixelController {
  constructor(private readonly pixelService: PixelService) {}

  @Post()
  async create(@Req() request: Request, @Body() addTocartDto: AddToCartDto,@Ip() ip: string) {
  
    return this.pixelService.eventAddToCart(request, addTocartDto,ip);
  }


  @Post('purchase')
  async createPurchase(@Req() request: Request,@Ip() ip:string) {

      return ip;
  }
}
