import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(email: string, password: string, name: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new ConflictException('Email already registered');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.users.create({ email, password: hash, name });
    return this.signToken(user.id, user.email, user.name);
  }

  async login(email: string, password: string) {
  console.log("LOGIN EMAIL:", email);

  const user = await this.users.findByEmail(email);
  console.log("USER FOUND:", user);

  if (!user) throw new UnauthorizedException('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  console.log("PASSWORD MATCH:", ok);

  if (!ok) throw new UnauthorizedException('Invalid credentials');

  return this.signToken(user.id, user.email, user.name);
}

  // payload: { sub, email }
  signToken(userId: string, email: string, name: string) {
  const payload = { sub: userId, email, name }; // shorthand for name: name
  return { accessToken: this.jwt.sign(payload) };
}
}
