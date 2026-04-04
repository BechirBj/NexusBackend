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
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { AdminUpdateMemberRoleDto } from "./dto/admin-update-member-role.dto";
import { AdminInviteMemberDto } from "./dto/admin-invite-member.dto";

@UseGuards(JwtAuthGuard)
@Controller("workspaces")
export class WorkspacesController {
  constructor(private service: WorkspacesService) {}

  // ===========================
  // Admin endpoints
  // ===========================

  @Get("admin")
  adminList() {
    return this.service.adminList();
  }

  @Patch("admin/member-role")
  adminUpdateMemberRole(@Body() dto: AdminUpdateMemberRoleDto) {
    console.log("Admin updating member role:", dto);
    return this.service.adminUpdateMemberRole(dto.memberId, dto.role);
  }

  @Get("admin/:workspaceId/members")
  adminGetMembers(@Param("workspaceId") workspaceId: string) {
    return this.service.adminGetMembers(workspaceId);
  }

  @Post("admin/:workspaceId/invite")
  async adminInvite(
    @Param("workspaceId") workspaceId: string,
    @Body() dto: AdminInviteMemberDto,
  ) {
    console.log("Admin inviting member:", workspaceId, dto);
    return this.service.adminInvite(workspaceId, dto.email, dto.role);
  }

  @Delete("admin/member/:id")
  async adminRemoveMember(@Param("id") memberId: string) {
    
    console.log("Admin removing member:", memberId);
    return this.service.adminRemoveMember(memberId);
  }

  // ===========================
  // Owner/member endpoints
  // ===========================

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.service.listForUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateWorkspaceDto) {
    return this.service.create(user.sub, dto.name, dto.description);
  }

  @Get(":id")
  get(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.service.get(id, user.sub);
  }

  @Patch(":id")
  update(@CurrentUser() user: { sub: string }, @Param("id") id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.service.update(id, user.sub, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.service.delete(id, user.sub);
  }

  @Post(":id/invite")
  invite(@CurrentUser() user: { sub: string }, @Param("id") id: string, @Body() dto: InviteMemberDto) {
    return this.service.invite(id, user.sub, dto.email, dto.role);
  }

  @Patch("member-role")
  updateRole(@CurrentUser() user: { sub: string }, @Body() dto: UpdateMemberRoleDto) {
    return this.service.updateMemberRole(dto.memberId, user.sub, dto.role);
  }

  @Get(":workspaceId/members")
  getMembers(@CurrentUser() user: { sub: string }, @Param("workspaceId") workspaceId: string) {
    return this.service.getMembers(workspaceId, user.sub);
  }

  @Delete("member/:id")
  removeMember(@CurrentUser() user: { sub: string }, @Param("id") memberId: string) {
    return this.service.removeMember(memberId, user.sub);
  }
}