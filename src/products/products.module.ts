import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductVariant } from './entities/product-variant.entity';
import { Attribute } from './entities/attribute.entity';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributeOptionVariant } from './entities/attributeOptionVariant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,ProductVariant,Attribute,AttributeOption,AttributeOptionVariant]),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService,TypeOrmModule],

})
export class ProductsModule {}
