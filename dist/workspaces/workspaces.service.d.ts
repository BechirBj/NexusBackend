import { Repository } from "typeorm";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { User } from "../users/user.entity";
export declare class WorkspacesService {
    private wsRepo;
    private wmRepo;
    private usersRepo;
    constructor(wsRepo: Repository<Workspace>, wmRepo: Repository<WorkspaceMember>, usersRepo: Repository<User>);
    adminList(): Promise<{
        id: string;
        name: string;
        description: string;
        ownerId: string;
        members: {
            membershipId: string;
            userId: string;
            role: import("./workspace-member.entity").WorkspaceRole;
            user: {
                id: string;
                email: string;
                name: string;
            };
        }[];
    }[]>;
    adminGetMembers(workspaceId: string): Promise<{
        membershipId: string;
        userId: string;
        role: import("./workspace-member.entity").WorkspaceRole;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }[]>;
    adminUpdateMemberRole(memberId: string, role: "editor" | "viewer"): Promise<WorkspaceMember>;
    adminInvite(workspaceId: string, email: string, role: "editor" | "viewer"): Promise<WorkspaceMember>;
    adminRemoveMember(memberId: string): Promise<{
        removed: boolean;
    }>;
    listForUser(userId: string): Promise<Workspace[]>;
    create(userId: string, name: string, description?: string): Promise<Workspace>;
    get(id: string, userId: string): Promise<Workspace>;
    update(id: string, userId: string, data: Partial<Workspace>): Promise<Workspace>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    invite(workspaceId: string, ownerId: string, email: string, role: "editor" | "viewer"): Promise<WorkspaceMember>;
    updateMemberRole(memberId: string, ownerId: string, role: "editor" | "viewer"): Promise<WorkspaceMember>;
    removeMember(memberId: string, ownerId: string): Promise<{
        removed: boolean;
    }>;
    getMembers(workspaceId: string, userId: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownedWorkspaces: Workspace[];
        memberships: WorkspaceMember[];
        membershipId: string;
        userId: string;
        role: import("./workspace-member.entity").WorkspaceRole;
        currentUserRole: string;
    }[]>;
    private ensureMember;
    private ensureOwner;
}
