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

  async findAll() {
    return await this.brandRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({
      where: { id, isActive: true },
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id: id,
      ...updateBrandDto,
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return await this.brandRepository.save(brand);
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
