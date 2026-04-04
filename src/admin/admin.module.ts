import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { SeedService } from 'src/seeds/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]),], 
  controllers: [AdminController],
  providers: [AdminService,SeedService],
  exports: [AdminService,SeedService],
})
export class AdminModule {}
