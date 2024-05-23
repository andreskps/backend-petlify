import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto) {
    try {
      const newPet = this.petRepository.create(createPetDto);
      return this.petRepository.save(newPet);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating pet: ${error.message}`);
    }
  }

  findAll() {
    return this.petRepository.find();
  }

  async findOne(id: number) {
    const pet = await this.findPetById(id);
    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    let pet = await this.findPetById(id);
    pet = this.petRepository.merge(pet, updatePetDto);
    try {
      return this.petRepository.save(pet);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating pet: ${error.message}`);
    }
  }

  async remove(id: number) {
    const pet = await this.findPetById(id);
    pet.isActive = false;
    return this.petRepository.save(pet);
  }

  private async findPetById(id: number): Promise<Pet> {
    const pet = await this.petRepository.findOne({
      where: { id, isActive: true },
    });
    if (!pet) {
      throw new NotFoundException(`Pet #${id} not found`);
    }
    return pet;
  }
}