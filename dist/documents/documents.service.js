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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./document.entity");
const workspace_member_entity_1 = require("../workspaces/workspace-member.entity");
const subject_entity_1 = require("../subjects/subject.entity");
const activities_service_1 = require("../activities/activities.service");
let DocumentsService = class DocumentsService {
    constructor(repo, subjectRepo, wmRepo, activities) {
        this.repo = repo;
        this.subjectRepo = subjectRepo;
        this.wmRepo = wmRepo;
        this.activities = activities;
    }
    async ensureSubjectMember(subjectId, userId) {
        const subject = await this.subjectRepo.findOne({ where: { id: subjectId } });
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        const m = await this.wmRepo.findOne({ where: { workspaceId: subject.workspaceId, userId } });
        if (!m)
            throw new common_1.ForbiddenException();
        return subject;
    }
    async upload(userId, subjectId, title, file) {
        const subject = await this.ensureSubjectMember(subjectId, userId);
        const doc = this.repo.create({
            subjectId,
            title,
            filePath: file.path.replace(/\\/g, '/'),
            originalFileName: file.originalname,
            fileSize: file.size,
            uploadedBy: userId,
        });
        const saved = await this.repo.save(doc);
        await this.activities.create({
            workspaceId: subject.workspaceId,
            subjectId,
            userId,
            type: 'DOCUMENT_UPLOAD',
            metadata: { documentId: saved.id, title },
        });
        return saved;
    }
    async listBySubject(subjectId, userId) {
        await this.ensureSubjectMember(subjectId, userId);
        return this.repo.find({ where: { subjectId } });
    }
    async delete(id, userId) {
        const doc = await this.repo.findOne({ where: { id }, relations: ['subject'] });
        if (!doc)
            throw new common_1.NotFoundException();
        await this.ensureSubjectMember(doc.subjectId, userId);
        await this.repo.delete(id);
        return { deleted: true };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(1, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __param(2, (0, typeorm_1.InjectRepository)(workspace_member_entity_1.WorkspaceMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        activities_service_1.ActivitiesService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map