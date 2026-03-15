import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
import { Subject } from '../subjects/subject.entity';
import { ActivitiesService } from 'src/activities/activities.service';
export declare class ReportsService {
    private repo;
    private subjectRepo;
    private wmRepo;
    private activities;
    constructor(repo: Repository<Report>, subjectRepo: Repository<Subject>, wmRepo: Repository<WorkspaceMember>, activities: ActivitiesService);
    private ensureSubjectMember;
    create(userId: string, data: Partial<Report>): Promise<Report>;
    listBySubject(subjectId: string, userId: string): Promise<Report[]>;
    get(id: string, userId: string): Promise<Report>;
    update(id: string, userId: string, data: Partial<Report>): Promise<Report>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
