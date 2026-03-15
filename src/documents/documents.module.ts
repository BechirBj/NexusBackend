import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
import { Subject } from '../subjects/subject.entity';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, WorkspaceMember, Subject]),
    UploadsModule,
    ActivitiesModule,
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
