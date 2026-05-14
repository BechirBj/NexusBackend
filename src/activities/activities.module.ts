import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User])],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
  exports: [ActivitiesService, TypeOrmModule],
})
export class ActivitiesModule {}
