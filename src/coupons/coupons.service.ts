import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    try {
      const newCoupon = this.couponRepository.create(createCouponDto);
      return await this.couponRepository.save(newCoupon);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Coupon code already exists');
      }

      throw new InternalServerErrorException('Error creating coupon');
    }
  }

  async findAll() {
    return this.couponRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number) {
     const coupon = await this.couponRepository.findOne({
      where:{
        id:id
      }
     })

      if(!coupon){
        throw new NotFoundException(`Coupon #${id} not found`)
      }

      return coupon;
       
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponRepository.preload({
      id: id,
      ...updateCouponDto,
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon #${id} not found`);
    }
    try {
      return await this.couponRepository.save(coupon);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Coupon code already exists');
      }

      throw new InternalServerErrorException('Error updating coupon');
      
    }
  }

  async remove(id: number) {
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon #${id} not found`);
    }
    return this.couponRepository.save({
      ...coupon,
      isActive: false,
    });
  }
}
