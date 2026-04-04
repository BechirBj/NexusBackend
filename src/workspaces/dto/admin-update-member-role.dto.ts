import { IsUUID, IsIn } from 'class-validator';

export class AdminUpdateMemberRoleDto {
  @IsUUID()
  memberId: string;

  @IsIn(['editor', 'viewer'])
  role: 'editor' | 'viewer';
}