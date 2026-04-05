import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { decrypt, encrypt } from 'src/common/utils/encryption.util';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) 
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  console.log('Seeding admin user with email:', adminEmail);
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminName = process.env.ADMIN_NAME;
  const adminSurname = process.env.ADMIN_SURNAME;

  if (!adminEmail || !adminPassword || !adminUsername) {
    throw new Error('Admin credentials are not fully defined.');
  }

  const allAdmins = await this.adminRepository.find();
  const existingAdmin = allAdmins.find((admin) => {
    try {
      return decrypt(admin.email) === adminEmail;
    } catch {
      return false;
    }
  });
  if (!existingAdmin) {
    console.log('No admin found. Creating default admin...');

    const encryptedEmail = encrypt(adminEmail);
    const encryptedUsername = encrypt(adminUsername);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log(encryptedEmail, encryptedUsername, hashedPassword)
    const adminUser = this.adminRepository.create({
      nom: adminName,
      prenom: adminSurname,
      username: encryptedUsername,
      email: encryptedEmail,
      password: hashedPassword,
    });

    await this.adminRepository.save(adminUser);
    console.log('Admin user created successfully! ✅');
  } else {
    console.log('Admin user already exists. ✅');
  }
}


}
