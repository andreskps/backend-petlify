import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'), // secret que se usa para firmar el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrae el token de la cabecera
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;


    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
