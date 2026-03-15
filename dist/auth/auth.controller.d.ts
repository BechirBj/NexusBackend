import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private auth;
    private config;
    constructor(auth: AuthService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(res: Response, dto: LoginDto): Promise<{
        message: string;
    }>;
    me(user: {
        sub: string;
        email: string;
        name: string;
    }): {
        sub: string;
        email: string;
        name: string;
    };
    logout(res: Response): {
        message: string;
    };
}
