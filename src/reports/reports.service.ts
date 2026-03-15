import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
import { Subject } from '../subjects/subject.entity';
import { ActivitiesService } from 'src/activities/activities.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>,
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

  async create(userId: string, data: Partial<Report>) {
    const subject = await this.ensureSubjectMember(data.subjectId!, userId);
    const r = await this.repo.save(this.repo.create(data));
    await this.activities.create({
      workspaceId: subject.workspaceId,
      subjectId: data.subjectId!,
      userId,
      type: 'REPORT_CREATE',
      metadata: { reportId: r.id, title: r.title },
    });
    return r;
  }

  async listBySubject(subjectId: string, userId: string) {
    await this.ensureSubjectMember(subjectId, userId);
    return this.repo.find({ where: { subjectId } });
  }

  async get(id: string, userId: string) {
    const r = await this.repo.findOne({ where: { id }, relations: ['subject'] });
    if (!r) throw new NotFoundException();
    await this.ensureSubjectMember(r.subjectId, userId);
    return r;
  }

  async update(id: string, userId: string, data: Partial<Report>) {
    const r = await this.get(id, userId);
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id } });
    const subject = await this.subjectRepo.findOne({ where: { id: r.subjectId } });
    await this.activities.create({
      workspaceId: subject!.workspaceId,
      subjectId: r.subjectId,
      userId,
      type: 'REPORT_EDIT',
      metadata: { reportId: id },
    });
    return updated;
  }

  async delete(id: string, userId: string) {
    await this.get(id, userId);
    await this.repo.delete(id);
    return { deleted: true };
  }
}
