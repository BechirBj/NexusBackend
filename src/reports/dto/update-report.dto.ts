import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(['draft', 'final', 'archived'])
  status?: 'draft' | 'final' | 'archived';
}
