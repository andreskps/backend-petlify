import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return  this.bannerRepository.find();
  } 

  async findOne(id: number) {
    const banner = await this.bannerRepository.findOne({
      where: { id },
    });

    if (!banner) {
      throw new  NotFoundException(`Banner #${id} not found`);
    }

    return banner;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  async remove(id: number) {
    const banner = await this.bannerRepository.findOne({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner #${id} not found`);
    }
 
    await this.cloudinaryService.destroyFile(banner.urlImg)

    return this.bannerRepository.remove(banner);
  }
}
