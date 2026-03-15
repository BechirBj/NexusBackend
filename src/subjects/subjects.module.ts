import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, WorkspaceMember])],
  providers: [SubjectsService],
  controllers: [SubjectsController],
})
export class SubjectsModule {}
