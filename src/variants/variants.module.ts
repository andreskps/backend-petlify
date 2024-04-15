import { forwardRef, Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant]),
  forwardRef(() => ProductsModule),
  AuthModule
],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService,TypeOrmModule],
})
export class VariantsModule {}
