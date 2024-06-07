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
import { AddToCartDto, EventInitiateCheckoutDto, EventViewContentDto } from './dto/create-pixel.dto';

import { Request } from 'express';

@Controller('pixel')
export class PixelController {
  constructor(private readonly pixelService: PixelService) {}

  @Post()
  async create(@Req() request: Request, @Body() addTocartDto: AddToCartDto,@Ip() ip: string) {
  
    return this.pixelService.eventAddToCart(request, addTocartDto,ip);
  }


  // @Post('purchase')
  // async createPurchase(@Req() request: Request,@Ip() ip:string) {

  //     return ip;
  // }

  @Post('viewcontent')
  async createViewContent(@Body() eventViewContentDto:EventViewContentDto,@Ip() ip:string,@Req() request: Request) {

    return this.pixelService.eventViewContent(request,eventViewContentDto,ip);
  }

  @Post('initiatecheckout')
  async createInitiateCheckout(@Body() eventInitiateCheckoutDto:EventInitiateCheckoutDto , @Req() request: Request,@Ip() ip:string) {

    return this.pixelService.eventInitiateCheckout(eventInitiateCheckoutDto,request,ip);

    
  }
}
