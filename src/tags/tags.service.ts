import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private repo: Repository<Tag>,
    @InjectRepository(Document) private docRepo: Repository<Document>,
    @InjectRepository(Report) private repRepo: Repository<Report>,
  ) {}

  create(data: Partial<Tag>) {
    return this.repo.save(this.repo.create(data));
  }

  listByWorkspace(workspaceId: string) {
    return this.repo.find({ where: { workspaceId } });
  }

  async update(id: string, data: Partial<Tag>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }

  async assign(tagId: string, targetType: 'document' | 'report', targetId: string) {
    const tag = await this.repo.findOne({ where: { id: tagId } });
    if (!tag) throw new NotFoundException('Tag not found');
    if (targetType === 'document') {
      const doc = await this.docRepo.findOne({ where: { id: targetId }, relations: ['tags'] });
      if (!doc) throw new NotFoundException('Document not found');
      doc.tags = [...(doc.tags ?? []), tag];
      return this.docRepo.save(doc);
    } else {
      const rep = await this.repRepo.findOne({ where: { id: targetId }, relations: ['tags'] });
      if (!rep) throw new NotFoundException('Report not found');
      rep.tags = [...(rep.tags ?? []), tag];
      return this.repRepo.save(rep);
    }
  }
}
