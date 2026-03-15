import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

export class CreateSubjectDto {
  @IsUUID()
  workspaceId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['private', 'shared', 'public'])
  visibility?: 'private' | 'shared' | 'public';
}
