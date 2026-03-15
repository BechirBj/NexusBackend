import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { WorkspaceMember } from '../workspaces/workspace-member.entity';
export declare class SubjectsService {
    private repo;
    private wmRepo;
    constructor(repo: Repository<Subject>, wmRepo: Repository<WorkspaceMember>);
    private ensureMember;
    list(userId: string): Promise<Subject[]>;
    listByWorkspace(workspaceId: string, userId: string): Promise<Subject[]>;
    create(userId: string, data: Partial<Subject>): Promise<Subject>;
    get(id: string, userId: string): Promise<Subject>;
    update(id: string, userId: string, data: Partial<Subject>): Promise<Subject>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
