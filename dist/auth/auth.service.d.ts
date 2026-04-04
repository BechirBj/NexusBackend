import { UsersService } from "../users/users.service";
import { AdminService } from "src/admin/admin.service";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private users;
    private adminService;
    private jwtService;
    constructor(users: UsersService, adminService: AdminService, jwtService: JwtService);
    register(email: string, password: string, name: string): Promise<{
        accessToken: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    private signUserToken;
    validateAdmin(email: string, password: string): Promise<any>;
    signInAdmin(admin: any): Promise<{
        accessToken: string;
    }>;
}
