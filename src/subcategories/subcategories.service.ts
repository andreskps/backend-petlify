import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: createSubcategoryDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createSubcategoryDto.categoryId} not found`,
        );
      }

      const subcategory = this.subcategoryRepository.create({
        ...createSubcategoryDto,
        category: category,
      });

      return this.subcategoryRepository.save(subcategory);
    } catch (error) {
      throw new InternalServerErrorException('Error creating subcategory');
    }
  }

  findAll() {
    return `This action returns all subcategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {

      const subcategory = await this.subcategoryRepository.preload({
        id: id,
        ...updateSubcategoryDto
      })

      if (!subcategory) {
        throw new NotFoundException(`Subcategory with ID ${id} not found`);
      }

      return this.subcategoryRepository.save(subcategory);

      
    
  }

  async remove(id: number) {
     const subcategory = await this.subcategoryRepository.findOne({
      where: {
        id: id,
      },
     });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }


    await this.subcategoryRepository.remove(subcategory);

    

  }
}
