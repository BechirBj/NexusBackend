import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Document, Report])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
