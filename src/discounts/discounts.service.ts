import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const newDiscount = this.discountRepository.create(createDiscountDto);
      return await this.discountRepository.save(newDiscount);
      
    } catch (error) {
       throw new InternalServerErrorException('Error creating discount');
    }
  }

  async findAll() {
    return await this.discountRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number) {
      const discount = await this.discountRepository.findOne({
        where: { id, isActive: true },
      });

      if (!discount) {
        throw new NotFoundException(`Discount #${id} not found`);
      }

      return discount;

  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
       const brand = await this.discountRepository.preload({
          id: id,
          ...updateDiscountDto,
        });

        if (!brand) {
          throw new NotFoundException(`Discount #${id} not found`);
        }

        return await this.discountRepository.save(brand);


  }

  async remove(id: number) {
    const discount = await this.discountRepository.findOne({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException(`Discount #${id} not found`);
    }

    discount.isActive = true;

    return await this.discountRepository.save(discount);
  }
}
