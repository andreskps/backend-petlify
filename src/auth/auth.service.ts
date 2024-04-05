import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePasswords } from 'src/common/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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
      select: ['id', 'name', 'email', 'password','roles'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!comparePasswords(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = this.createJwt({
      id: user.id,
      email: user.email,
      userName: user.name,
    });

    return {
      access_token,
      name: user.name,
      roles: user.roles,
    };
  }


  private createJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
