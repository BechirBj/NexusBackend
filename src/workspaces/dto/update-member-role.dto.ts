import { IsUUID, IsString } from 'class-validator';

export class UpdateMemberRoleDto {
  @IsUUID()
  memberId: string;

  @IsString()
  role: 'owner' | 'editor' | 'viewer';
}
