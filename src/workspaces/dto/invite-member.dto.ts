import { IsUUID, IsEmail, IsString } from 'class-validator';

export class InviteMemberDto {
  @IsUUID()
  workspaceId: string;

  @IsEmail()
  email: string;

  @IsString()
  role: 'editor' | 'viewer';
}
