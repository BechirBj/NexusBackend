import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private service: WorkspacesService) {}

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.service.listForUser(user.sub);
  }

  @Post()
  create(@CurrentUser() user: { sub: string; email: string ,name: string}, @Body() dto: CreateWorkspaceDto) {
    console.log(user);
    console.log('Creating workspace with data:', dto);
    return this.service.create(user.sub, dto.name, dto.description);
  }

  @Get(':id')
  get(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.get(id, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.service.update(id, user.sub, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.service.delete(id, user.sub);
  }

  @Post(':id/invite')
  invite(@CurrentUser() user: { sub: string }, @Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.service.invite(id, user.sub, dto.email, dto.role);
  }

  @Patch('member-role')
  updateRole(@CurrentUser() user: { sub: string }, @Body() dto: UpdateMemberRoleDto) {
    return this.service.updateMemberRole(dto.memberId, user.sub, dto.role);
  }

  @Delete('member')
  removeMember(@CurrentUser() user: { sub: string }, @Body() dto: RemoveMemberDto) {
    return this.service.removeMember(dto.memberId, user.sub);
  }
}
