import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { AdminService } from "src/admin/admin.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  // ================= USER =================

  async register(email: string, password: string, name: string) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new ConflictException("Email already registered");

    const hash = await bcrypt.hash(password, 10);

    const user = await this.users.create({
      email,
      password: hash,
      name,
    });

    return this.signUserToken(user.id, user.email, user.name);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return this.signUserToken(user.id, user.email, user.name);
  }

  private signUserToken(userId: string, email: string, name: string) {
    const payload = {
      sub: userId,
      email,
      name,
      role: "user",
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // ================= ADMIN =================

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin) return null;

    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) return null;

    return admin; // no need to decrypt unless necessary
  }

  async signInAdmin(admin: any) {
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.nom,
      prenom: admin.prenom,
      username: admin.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}