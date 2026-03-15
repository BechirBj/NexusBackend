import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['private', 'shared', 'public'])
  visibility?: 'private' | 'shared' | 'public';
}
