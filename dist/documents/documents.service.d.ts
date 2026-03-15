import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
import { Subject } from '../subjects/subject.entity';
import { ActivitiesService } from 'src/activities/activities.service';
export declare class DocumentsService {
    private repo;
    private subjectRepo;
    private wmRepo;
    private activities;
    constructor(repo: Repository<Document>, subjectRepo: Repository<Subject>, wmRepo: Repository<WorkspaceMember>, activities: ActivitiesService);
    private ensureSubjectMember;
    upload(userId: string, subjectId: string, title: string, file: Express.Multer.File): Promise<Document>;
    listBySubject(subjectId: string, userId: string): Promise<Document[]>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
