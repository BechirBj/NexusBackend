import { IsString, IsOptional, IsUUID, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateSubjectDto {
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['private', 'shared', 'public'])
  visibility?: 'private' | 'shared' | 'public';
}
