import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(files: Express.Multer.File[], createBannerDto: CreateBannerDto) {
    const response = await this.cloudinaryService.uploadFiles(files,"banners");
    
    const banner = this.bannerRepository.create({
      ...createBannerDto,
      urlImg: response[0].secure_url
    });

    return this.bannerRepository.save(banner);
  }

  findAll() {
    return `This action returns all banners`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
