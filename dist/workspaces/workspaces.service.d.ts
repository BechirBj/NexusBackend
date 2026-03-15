import { Repository } from 'typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { User } from '../users/user.entity';
export declare class WorkspacesService {
    private wsRepo;
    private wmRepo;
    private usersRepo;
    constructor(wsRepo: Repository<Workspace>, wmRepo: Repository<WorkspaceMember>, usersRepo: Repository<User>);
    listForUser(userId: string): Promise<Workspace[]>;
    create(userId: string, name: string, description?: string): Promise<Workspace>;
    get(id: string, userId: string): Promise<Workspace>;
    update(id: string, userId: string, data: Partial<Workspace>): Promise<Workspace>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    invite(workspaceId: string, ownerId: string, email: string, role: 'editor' | 'viewer'): Promise<WorkspaceMember>;
    updateMemberRole(memberId: string, ownerId: string, role: 'owner' | 'editor' | 'viewer'): Promise<WorkspaceMember>;
    removeMember(memberId: string, ownerId: string): Promise<{
        removed: boolean;
    }>;
    private ensureMember;
    private ensureOwner;
}
