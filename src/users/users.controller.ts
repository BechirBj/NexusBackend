import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/guards/roles.decorator";
import { UserRole } from "src/enums/user-role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("users")
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(":id")
  get(@Param("id") id: string) {
    return this.users.findById(id);
  }
  @Get()
  getAll() {
    return this.users.findAll();
  }

  @Get("/hh")
  qq() {
    return "Hello, Users!";
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.users.delete(id);
  }
}
