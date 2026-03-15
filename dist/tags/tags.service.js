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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("./tag.entity");
const document_entity_1 = require("../documents/document.entity");
const report_entity_1 = require("../reports/report.entity");
let TagsService = class TagsService {
    constructor(repo, docRepo, repRepo) {
        this.repo = repo;
        this.docRepo = docRepo;
        this.repRepo = repRepo;
    }
    create(data) {
        return this.repo.save(this.repo.create(data));
    }
    listByWorkspace(workspaceId) {
        return this.repo.find({ where: { workspaceId } });
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.repo.findOne({ where: { id } });
    }
    async delete(id) {
        await this.repo.delete(id);
        return { deleted: true };
    }
    async assign(tagId, targetType, targetId) {
        var _a, _b;
        const tag = await this.repo.findOne({ where: { id: tagId } });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        if (targetType === 'document') {
            const doc = await this.docRepo.findOne({ where: { id: targetId }, relations: ['tags'] });
            if (!doc)
                throw new common_1.NotFoundException('Document not found');
            doc.tags = [...((_a = doc.tags) !== null && _a !== void 0 ? _a : []), tag];
            return this.docRepo.save(doc);
        }
        else {
            const rep = await this.repRepo.findOne({ where: { id: targetId }, relations: ['tags'] });
            if (!rep)
                throw new common_1.NotFoundException('Report not found');
            rep.tags = [...((_b = rep.tags) !== null && _b !== void 0 ? _b : []), tag];
            return this.repRepo.save(rep);
        }
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __param(1, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(2, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TagsService);
//# sourceMappingURL=tags.service.js.map