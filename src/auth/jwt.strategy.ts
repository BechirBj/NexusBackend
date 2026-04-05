import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Admin } from '../admin/entities/admin.entity';
import { Request } from 'express';

// Validates JWT and attaches payload to request.user
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // First check User table
    let user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (user) {
      return {
        sub: payload.sub,
        email: payload.email,
        role: user.role,
        name: user.name,
      };
    }

    // If not found in User, check Admin table
    const admin = await this.adminRepo.findOne({ where: { id: payload.sub } });
    if (admin) {
      return {
        sub: payload.sub,
        email: payload.email,
        role: admin.role,
        name: `${admin.prenom} ${admin.nom}`,
      };
    }

    // If neither, default to USER
    return {
      sub: payload.sub,
      email: payload.email,
      role: 'USER',
      name: payload.email,
    };
  }
}
