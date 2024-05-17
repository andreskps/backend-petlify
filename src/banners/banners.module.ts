import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Banner
    ])
    ,
    AuthModule,
    CloudinaryModule
  ],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
