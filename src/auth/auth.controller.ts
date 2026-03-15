import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private auth: AuthService,
    private config: ConfigService,
  ) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    console.log("Registering user:", dto);
    return this.auth.register(dto.email, dto.password, dto.name);
  }

  @Post("login")
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const { accessToken } = await this.auth.login(dto.email, dto.password);

    const isProd = this.config.get<string>("MODE_ENV") === "production";

    console.log("Setting cookie with access token:", accessToken);
    console.log("Production mode:", isProd);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return { message: "Logged in successfully" };
  }

  // @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: { sub: string; email: string; name: string }) {
    return user;
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = this.config.get<string>("MODE_ENV") === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return { message: "Logged out" };
  }
}