import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePasswords } from 'src/common/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'name', 'email', 'password'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!comparePasswords(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      userName: user.name,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
}
