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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/validate-roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../common/utils/fileFilter';


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
  @Auth(ValidRoles.admin)
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Post('upload')
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter,
    }),
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
     
    if (!files || !files.length) {
      throw new BadRequestException('No files uploaded');
    }
    return this.productsService.uploadImages(files);
  }

}
