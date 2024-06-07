import { Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProvidersService {

  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>
  ) {
    
  }



  create(createProviderDto: CreateProviderDto) {
    return 'This action adds a new provider';
  }

  async findAll() {
    return await this.providerRepository.find({
      where: {isActive: true}
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
