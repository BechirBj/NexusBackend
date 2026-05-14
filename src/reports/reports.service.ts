import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './report.entity';
import { Subject } from '../subjects/subject.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
import { ActivitiesService } from 'src/activities/activities.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,

    @InjectRepository(WorkspaceMember)
    private readonly memberRepo: Repository<WorkspaceMember>,

    private readonly activitiesService: ActivitiesService,
    
  ) {}

  /**
   * Ensures the user belongs to the workspace of the subject.
   */
  private async ensureSubjectMember(
    subjectId: string,
    userId: string,
  ): Promise<{
    subject: Subject;
    membership: WorkspaceMember;
  }> {
    const subject = await this.subjectRepo.findOne({
      where: { id: subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const membership = await this.memberRepo.findOne({
      where: {
        workspaceId: subject.workspaceId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this workspace',
      );
    }

    return { subject, membership };
  }

  /**
   * Ensures the user can edit/upload reports.
   */
  private async ensureSubjectEditor(
    subjectId: string,
    userId: string,
  ): Promise<Subject> {
    const { subject, membership } = await this.ensureSubjectMember(
      subjectId,
      userId,
    );

    if (membership.role === 'viewer') {
      throw new ForbiddenException(
        'You do not have permission to modify reports',
      );
    }

    return subject;
  }

  async create(userId: string, data: Partial<Report>) {
    if (!data.subjectId) {
      throw new NotFoundException('Subject ID is required');
    }

    const subject = await this.ensureSubjectEditor(
      data.subjectId,
      userId,
    );

    const report = this.reportRepo.create(data);

    const savedReport = await this.reportRepo.save(report);

    await this.activitiesService.create({
      workspaceId: subject.workspaceId,
      subjectId: subject.id,
      userId,
      type: 'REPORT_CREATE',
      metadata: {
        reportId: savedReport.id,
        title: savedReport.title,
      },
    });

    return savedReport;
  }

  async listBySubject(subjectId: string, userId: string) {
    await this.ensureSubjectMember(subjectId, userId);

    return this.reportRepo.find({
      where: { subjectId },
      order: { createdAt: 'DESC' }, // optional improvement
    });
  }

  async get(id: string, userId: string) {
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: ['subject'],
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.ensureSubjectMember(report.subjectId, userId);

    return report;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Report>,
  ) {
    const report = await this.get(id, userId);

    const subject = await this.ensureSubjectEditor(
      report.subjectId,
      userId,
    );

    Object.assign(report, data);

    const updatedReport = await this.reportRepo.save(report);

    await this.activitiesService.create({
      workspaceId: subject.workspaceId,
      subjectId: subject.id,
      userId,
      type: 'REPORT_EDIT',
      metadata: {
        reportId: updatedReport.id,
      },
    });

    return updatedReport;
  }

  async delete(id: string, userId: string) {
    const report = await this.get(id, userId);

    await this.ensureSubjectEditor(report.subjectId, userId);

    await this.reportRepo.delete(id);

    await this.activitiesService.create({
      workspaceId: report.subject.workspaceId,
      subjectId: report.subjectId,
      userId,
type: 'REPORT_EDIT',      metadata: {
        reportId: report.id,
        title: report.title,
      },
    });

    return {
      deleted: true,
    };
  }
}