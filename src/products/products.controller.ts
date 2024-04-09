import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/validate-roles.enum';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateVariantDto } from './dto/create-variant.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('admin')
  @Auth(ValidRoles.admin)
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Put('variant/:id')
  @Auth(ValidRoles.admin)
  updateVariant(@Param('id', ParseIntPipe) id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.productsService.updateVariant(+id, updateVariantDto);
  }

  @Post('variant/:id')
  @Auth(ValidRoles.admin)
  createVariant(@Param('id', ParseUUIDPipe) id: string, @Body() createVariantDto: CreateVariantDto) {
    return this.productsService.createVariant(id, createVariantDto);
  }
}
