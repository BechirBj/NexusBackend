import { Workspace } from '../workspaces/workspace.entity';
import { WorkspaceMember } from 'src/workspaces/workspace-member.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    ownedWorkspaces: Workspace[];
    memberships: WorkspaceMember[];
}
