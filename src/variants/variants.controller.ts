import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/Validate-Roles.enum';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.createVariant(createVariantDto);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id',ParseIntPipe) id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantsService.updateVariant(+id, updateVariantDto);
  }


  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id',ParseIntPipe) id: string) {
    return this.variantsService.remove(+id);
  }
}
