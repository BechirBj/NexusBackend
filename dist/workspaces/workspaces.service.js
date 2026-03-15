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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workspace_entity_1 = require("./workspace.entity");
const workspace_member_entity_1 = require("./workspace-member.entity");
const user_entity_1 = require("../users/user.entity");
let WorkspacesService = class WorkspacesService {
    constructor(wsRepo, wmRepo, usersRepo) {
        this.wsRepo = wsRepo;
        this.wmRepo = wmRepo;
        this.usersRepo = usersRepo;
    }
    async listForUser(userId) {
        const memberships = await this.wmRepo.find({ where: { userId } });
        const ids = memberships.map((m) => m.workspaceId);
        if (!ids.length)
            return [];
        return this.wsRepo.find({ where: { id: (0, typeorm_2.In)(ids) } });
    }
    async create(userId, name, description) {
        const ws = this.wsRepo.create({ name, description, ownerId: userId });
        const saved = await this.wsRepo.save(ws);
        await this.wmRepo.save(this.wmRepo.create({ workspaceId: saved.id, userId, role: 'owner' }));
        return saved;
    }
    async get(id, userId) {
        await this.ensureMember(id, userId);
        return this.wsRepo.findOne({ where: { id } });
    }
    async update(id, userId, data) {
        await this.ensureOwner(id, userId);
        await this.wsRepo.update(id, data);
        return this.wsRepo.findOne({ where: { id } });
    }
    async delete(id, userId) {
        await this.ensureOwner(id, userId);
        await this.wsRepo.delete(id);
        return { deleted: true };
    }
    async invite(workspaceId, ownerId, email, role) {
        await this.ensureOwner(workspaceId, ownerId);
        const user = await this.usersRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const membership = this.wmRepo.create({ workspaceId, userId: user.id, role });
        return this.wmRepo.save(membership);
    }
    async updateMemberRole(memberId, ownerId, role) {
        const member = await this.wmRepo.findOne({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException();
        await this.ensureOwner(member.workspaceId, ownerId);
        member.role = role;
        return this.wmRepo.save(member);
    }
    async removeMember(memberId, ownerId) {
        const member = await this.wmRepo.findOne({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException();
        await this.ensureOwner(member.workspaceId, ownerId);
        await this.wmRepo.delete(memberId);
        return { removed: true };
    }
    async ensureMember(workspaceId, userId) {
        const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
        if (!m)
            throw new common_1.ForbiddenException();
    }
    async ensureOwner(workspaceId, userId) {
        const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
        if (!m || m.role !== 'owner')
            throw new common_1.ForbiddenException('Owner required');
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workspace_entity_1.Workspace)),
    __param(1, (0, typeorm_1.InjectRepository)(workspace_member_entity_1.WorkspaceMember)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map