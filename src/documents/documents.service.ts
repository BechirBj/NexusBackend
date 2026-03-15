import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
import { Subject } from '../subjects/subject.entity';
import { ActivitiesService } from 'src/activities/activities.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private repo: Repository<Document>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(WorkspaceMember) private wmRepo: Repository<WorkspaceMember>,
    private activities: ActivitiesService,
  ) {}

  private async ensureSubjectMember(subjectId: string, userId: string) {
    const subject = await this.subjectRepo.findOne({ where: { id: subjectId } });
    if (!subject) throw new NotFoundException('Subject not found');
    const m = await this.wmRepo.findOne({ where: { workspaceId: subject.workspaceId, userId } });
    if (!m) throw new ForbiddenException();
    return subject;
  }

  async upload(userId: string, subjectId: string, title: string, file: Express.Multer.File) {
    const subject = await this.ensureSubjectMember(subjectId, userId);
    const doc = this.repo.create({
      subjectId,
      title,
      filePath: file.path.replace(/\\/g, '/'),
      originalFileName: file.originalname,
      fileSize: file.size,
      uploadedBy: userId,
    });
    const saved = await this.repo.save(doc);
    await this.activities.create({
      workspaceId: subject.workspaceId,
      subjectId,
      userId,
      type: 'DOCUMENT_UPLOAD',
      metadata: { documentId: saved.id, title },
    });
    return saved;
  }

  async listBySubject(subjectId: string, userId: string) {
    await this.ensureSubjectMember(subjectId, userId);
    return this.repo.find({ where: { subjectId } });
  }

  async delete(id: string, userId: string) {
    const doc = await this.repo.findOne({ where: { id }, relations: ['subject'] });
    if (!doc) throw new NotFoundException();
    await this.ensureSubjectMember(doc.subjectId, userId);
    await this.repo.delete(id);
    return { deleted: true };
  }
}
