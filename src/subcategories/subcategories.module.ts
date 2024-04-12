import { forwardRef, Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subcategory
    ]),
    AuthModule,
    forwardRef(()=>CategoriesModule)
  ],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
  exports: [SubcategoriesService,TypeOrmModule]
})
export class SubcategoriesModule {}
