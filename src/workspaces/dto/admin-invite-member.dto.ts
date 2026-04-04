import { IsEmail, IsEnum } from "class-validator";
import { WorkspaceRole } from "../workspace-member.entity";

export class AdminInviteMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(["editor", "viewer"])
  role: "editor" | "viewer";
}