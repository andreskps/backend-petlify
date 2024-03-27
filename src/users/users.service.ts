import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { hashPassword } from 'src/common/utils/bcrypt';
import { ErrorHandlingService } from 'src/common/services/ErrorHandling.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private errorHandlingService: ErrorHandlingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);

      newUser.password = hashPassword(newUser.password);

      await this.userRepository.save(newUser);

      delete newUser.password;

      return newUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return this.errorHandlingService.handleDBError(error);
      }

      return this.errorHandlingService.handleErrors(error);
      
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
