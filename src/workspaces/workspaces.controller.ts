import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/guards/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { AdminUpdateMemberRoleDto } from "./dto/admin-update-member-role.dto";
import { AdminInviteMemberDto } from "./dto/admin-invite-member.dto";
import { UserRole } from "src/enums/user-role.enum";

interface UserPayload {
  sub: string;
  email: string;
  role: UserRole.ADMIN | "USER";
}

@UseGuards(JwtAuthGuard)
@Controller("workspaces")
export class WorkspacesController {
  constructor(private service: WorkspacesService) {}

  // ===========================
  // Admin endpoints
  // ===========================

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("admin")
  adminList() {
    return this.service.adminList();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("admin/:workspaceId/members")
  adminGetMembers(@Param("workspaceId") workspaceId: string) {
    console.log("Admin fetching members for workspace:", workspaceId);
    return this.service.adminGetMembers(workspaceId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("admin/:workspaceId")
  adminGetById(@Param("workspaceId") workspaceId: string) {
    return this.service.getAdmin(workspaceId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch("admin/member-role")
  adminUpdateMemberRole(@Body() dto: AdminUpdateMemberRoleDto) {
    console.log("Admin updating member role:", dto);
    return this.service.adminUpdateMemberRole(dto.memberId, dto.role);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post("admin/:workspaceId/invite")
  adminInvite(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: AdminInviteMemberDto,
  ) {
    return this.service.adminInvite(workspaceId, dto.email, dto.role);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete("admin/member/:memberId")
  adminRemoveMember(@Param("memberId") memberId: string) {
    return this.service.adminRemoveMember(memberId);
  }

  // ===========================
  // User endpoints
  // NOTE: Static routes (e.g. "member-role") must come BEFORE dynamic (":id")
  // ===========================

  @Get()
  list(@CurrentUser() user: UserPayload) {
    return this.service.listForUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: UserPayload, @Body() dto: CreateWorkspaceDto) {
    return this.service.create(user.sub, dto.name, dto.description);
  }

  // Static route — must be before :id
  @Patch("member-role")
  updateRole(
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.service.updateMemberRole(dto.memberId, user, dto.role);
  }

  // Static route — must be before :id
  @Delete("member/:memberId")
  removeMember(
    @CurrentUser() user: UserPayload,
    @Param("memberId") memberId: string,
  ) {
    return this.service.removeMember(memberId, user);
  }

  @Get(":id")
  get(@CurrentUser() user: UserPayload, @Param("id") id: string) {
    return this.service.get(id, user);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: UserPayload,
    @Param("id") id: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.service.update(id, user, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: UserPayload, @Param("id") id: string) {
    return this.service.delete(id, user);
  }

  @Post(":id/invite")
  invite(
    @CurrentUser() user: UserPayload,
    @Param("id") id: string,
    @Body() dto: InviteMemberDto,
  ) {
    return this.service.invite(id, user, dto.email, dto.role);
  }

  @Get(":workspaceId/members")
  getMembers(
    @CurrentUser() user: UserPayload,
    @Param("workspaceId") workspaceId: string,
  ) {
    return this.service.getMembers(workspaceId, user);
  }
}