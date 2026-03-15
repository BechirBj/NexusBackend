import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
export declare class WorkspacesController {
    private service;
    constructor(service: WorkspacesService);
    list(user: {
        sub: string;
    }): Promise<import("./workspace.entity").Workspace[]>;
    create(user: {
        sub: string;
        email: string;
        name: string;
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
    removeMember(user: {
        sub: string;
    }, dto: RemoveMemberDto): Promise<{
        removed: boolean;
    }>;
}
