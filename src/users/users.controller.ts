import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/guards/roles.decorator";
import { UserRole } from "src/enums/user-role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  getAll() {
    return this.users.findAll();
  }


  @Get(":id")
  get(@Param("id") id: string) {
    return this.users.findById(id);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.users.delete(id);
  }
}
