import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { AdminUpdateMemberRoleDto } from "./dto/admin-update-member-role.dto";
import { AdminInviteMemberDto } from "./dto/admin-invite-member.dto";
export declare class WorkspacesController {
    private service;
    constructor(service: WorkspacesService);
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
    adminUpdateMemberRole(dto: AdminUpdateMemberRoleDto): Promise<import("./workspace-member.entity").WorkspaceMember>;
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
    adminInvite(workspaceId: string, dto: AdminInviteMemberDto): Promise<import("./workspace-member.entity").WorkspaceMember>;
    adminRemoveMember(memberId: string): Promise<{
        removed: boolean;
    }>;
    list(user: {
        sub: string;
    }): Promise<import("./workspace.entity").Workspace[]>;
    create(user: {
        sub: string;
    }, dto: CreateWorkspaceDto): Promise<import("./workspace.entity").Workspace>;
    get(user: {
        sub: string;
    }, id: string): Promise<import("./workspace.entity").Workspace>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateWorkspaceDto): Promise<import("./workspace.entity").Workspace>;
    remove(user: {
        sub: string;
    }, id: string): Promise<{
        deleted: boolean;
    }>;
    invite(user: {
        sub: string;
    }, id: string, dto: InviteMemberDto): Promise<import("./workspace-member.entity").WorkspaceMember>;
    updateRole(user: {
        sub: string;
    }, dto: UpdateMemberRoleDto): Promise<import("./workspace-member.entity").WorkspaceMember>;
    getMembers(user: {
        sub: string;
    }, workspaceId: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        ownedWorkspaces: import("./workspace.entity").Workspace[];
        memberships: import("./workspace-member.entity").WorkspaceMember[];
        membershipId: string;
        userId: string;
        role: import("./workspace-member.entity").WorkspaceRole;
        currentUserRole: string;
    }[]>;
    removeMember(user: {
        sub: string;
    }, memberId: string): Promise<{
        removed: boolean;
    }>;
}
