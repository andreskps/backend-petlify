import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Attribute } from './entities/attribute.entity';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributeOptionVariant } from './entities/attributeOptionVariant.entity';
import { VariantsModule } from 'src/variants/variants.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ProductImage } from './entities/ProductImage';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Attribute,AttributeOption,AttributeOptionVariant,ProductImage]),
    AuthModule,
    forwardRef(() => VariantsModule),
    CloudinaryModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService,TypeOrmModule],

})
export class ProductsModule {}
