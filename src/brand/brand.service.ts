import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const newBrand = this.brandRepository.create(createBrandDto);
      return await this.brandRepository.save(newBrand);
    } catch (error) {
      throw new InternalServerErrorException('Error creating brand');
    }
  }

  findAll() {
    return `This action returns all brand`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id: id,
      ...updateBrandDto,
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    try {
      return await this.brandRepository.save(brand);
    } catch (error) {
      throw new InternalServerErrorException('Error updating brand');
    }
  }

  async remove(id: number) {
    const brand = await this.brandRepository.findOne({
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    brand.isActive = false;

    return await this.brandRepository.save(brand);
  }
}
