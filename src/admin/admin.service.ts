import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decrypt } from 'src/common/utils/encryption.util';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findAdminByEmail(rawEmail: string): Promise<Admin | null> {
    const allAdmins = await this.adminRepository.find();

    const match = allAdmins.find((admin) => {
      try {
        return decrypt(admin.email) === rawEmail;
      } catch {
        return false;
      }
    });

    return match ?? null;
  }

  async getDecryptedAdmin(admin: Admin) {
    return {
      ...admin,
      email: decrypt(admin.email),
      username: decrypt(admin.username),
    };
  }
  
}
