import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateReportDto {
  @IsUUID()
  subjectId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(['draft', 'final', 'archived'])
  status?: 'draft' | 'final' | 'archived';
}
