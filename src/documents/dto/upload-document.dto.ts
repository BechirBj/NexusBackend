import { IsString, IsUUID } from 'class-validator';

export class UploadDocumentDto {
  @IsUUID()
  subjectId: string;

  @IsString()
  title: string;
}
