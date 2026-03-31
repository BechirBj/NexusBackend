import { IsString } from 'class-validator';

export class UpdateDocumentTitleDto {
  @IsString()
  title: string;
}
