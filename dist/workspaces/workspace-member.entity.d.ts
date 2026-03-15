import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
export type WorkspaceRole = 'owner' | 'editor' | 'viewer';
export declare class WorkspaceMember {
    id: string;
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
    workspace: Workspace;
    user: User;
    createdAt: Date;
}
