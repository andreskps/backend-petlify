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
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/validate-roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../common/utils/fileFilter';
import { QueryProductDto } from './dto/queries..dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('admin')
  @Auth(ValidRoles.admin)
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }
  @Get('popular')
  findPopular() {
    return this.productsService.findPopular();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @Get('byPet/:pet')
  findPetProducts(@Param('pet') pet: string, @Query() query: QueryProductDto) {
    return this.productsService.findAllByPet(pet, query);
  }

  @Get('byCategory/:slug')
  findProductsCategory(
    @Param('slug') slug: string,
    @Query() query: QueryProductDto,
  ) {
    return this.productsService.findAllByCategory(slug, query);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
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

  // @Post('save-images/:id')
  // @Auth(ValidRoles.admin)

  @Delete('delete-image/:id')
  @Auth(ValidRoles.admin)
  deleteImage(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.deleteImage(+id);
  }
}
