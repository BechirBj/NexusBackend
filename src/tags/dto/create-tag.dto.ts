import { IsString, IsUUID } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsUUID()
  workspaceId: string;
}
