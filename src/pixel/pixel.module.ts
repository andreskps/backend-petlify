import { Module } from '@nestjs/common';
import { PixelService } from './pixel.service';
import { PixelController } from './pixel.controller';

@Module({
  controllers: [PixelController],
  providers: [PixelService],
  exports: [PixelService],
})
export class PixelModule {}
