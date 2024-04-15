import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create({
        name: createCategoryDto.name,
      });

      const savedCategory = await this.categoryRepository.save(category);

      const subcategories = createCategoryDto.subcategories.map((subcategory) =>
        this.subcategoryRepository.create({
          name: subcategory.name,
          category: savedCategory,
        }),
      );

      await Promise.all(
        subcategories.map((subcategory) =>
          this.subcategoryRepository.save(subcategory),
        ),
      );

      return savedCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating category and subcategories',
      );
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      relations: ['subcategories'],
    });

    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id: id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.categoryRepository.save(category);

    return updatedCategory;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
