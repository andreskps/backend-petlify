import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/Validate-Roles.enum';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(+id);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseIntPipe) id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(+id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(+id);
  }
}
