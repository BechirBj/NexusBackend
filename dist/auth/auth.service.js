"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const admin_service_1 = require("../admin/admin.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(users, adminService, jwtService) {
        this.users = users;
        this.adminService = adminService;
        this.jwtService = jwtService;
    }
    async register(email, password, name) {
        const exists = await this.users.findByEmail(email);
        if (exists)
            throw new common_1.ConflictException("Email already registered");
        const hash = await bcrypt.hash(password, 10);
        const user = await this.users.create({
            email,
            password: hash,
            name,
        });
        return this.signUserToken(user.id, user.email, user.name);
    }
    async login(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException("Invalid credentials");
        return this.signUserToken(user.id, user.email, user.name);
    }
    signUserToken(userId, email, name) {
        const payload = {
            sub: userId,
            email,
            name,
            role: "user",
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async validateAdmin(email, password) {
        const admin = await this.adminService.findAdminByEmail(email);
        if (!admin)
            return null;
        const passwordValid = await bcrypt.compare(password, admin.password);
        if (!passwordValid)
            return null;
        return admin;
    }
    async signInAdmin(admin) {
        const payload = {
            sub: admin.id,
            email: admin.email,
            role: admin.role,
            name: admin.nom,
            prenom: admin.prenom,
            username: admin.username,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        admin_service_1.AdminService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map