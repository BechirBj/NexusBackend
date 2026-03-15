import { IsUUID, IsString } from 'class-validator';

export class AssignTagDto {
  @IsUUID()
  tagId: string;

  @IsUUID()
  targetId: string; // documentId or reportId

  @IsString()
  targetType: 'document' | 'report';
}
