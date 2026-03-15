import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private repo: Repository<Subject>,
    @InjectRepository(WorkspaceMember) private wmRepo: Repository<WorkspaceMember>,
  ) {}

  private async ensureMember(workspaceId: string, userId: string) {
    const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
    if (!m) throw new ForbiddenException();
  }

  list(userId: string) {
    // list subjects user has membership for
    return this.repo
      .createQueryBuilder('subject')
      .innerJoin(WorkspaceMember, 'wm', 'wm.workspaceId = subject.workspaceId AND wm.userId = :userId', {
        userId,
      })
      .getMany();
  }

  listByWorkspace(workspaceId: string, userId: string) {
    return this.repo
      .createQueryBuilder('subject')
      .where('subject.workspaceId = :workspaceId', { workspaceId })
      .innerJoin(WorkspaceMember, 'wm', 'wm.workspaceId = subject.workspaceId AND wm.userId = :userId', {
        userId,
      })
      .getMany();
  }
  async create(userId: string, data: Partial<Subject>) {
    await this.ensureMember(data.workspaceId!, userId);
    const s = this.repo.create(data);
    return this.repo.save(s);
  }

  async get(id: string, userId: string) {
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) throw new NotFoundException();
    await this.ensureMember(subject.workspaceId, userId);
    return subject;
  }

  async update(id: string, userId: string, data: Partial<Subject>) {
    const subject = await this.get(id, userId);
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string, userId: string) {
    const subject = await this.get(id, userId);
    await this.repo.delete(subject.id);
    return { deleted: true };
  }
}
