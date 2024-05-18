import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, ParseIntPipe } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/Validate-Roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/common/utils/fileFilter';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files',2, {
      fileFilter: fileFilter,
    }),
  )
  create(@UploadedFiles() files:Express.Multer.File[],  @Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(files, createBannerDto);
  }

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: string) {
    return this.bannersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannersService.update(+id, updateBannerDto);
  }


  @Auth(ValidRoles.admin)
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: string) {
    return this.bannersService.remove(+id);
  }
}
