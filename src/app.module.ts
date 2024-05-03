import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { BrandModule } from './brand/brand.module';
import { PetModule } from './pet/pet.module';
import { BadgeModule } from './badge/badge.module';
import { ReviewModule } from './review/review.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { VariantsModule } from './variants/variants.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CouponsModule } from './coupons/coupons.module';
import { DiscountsModule } from './discounts/discounts.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { MunicipiosModule } from './municipios/municipios.module';

@Module({
  imports: [

    ConfigModule.forRoot({isGlobal: true}),


    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // Sirve para detectar cambios en la db, se coloca false en produccion
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    ProductsModule,

    CategoriesModule,

    UsersModule,

    AuthModule,

    OrderModule,

    BrandModule,

    PetModule,

    BadgeModule,

    ReviewModule,

    SubcategoriesModule,

    VariantsModule,

    CloudinaryModule,

    CouponsModule,

    DiscountsModule,

    DepartamentosModule,

    MunicipiosModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
