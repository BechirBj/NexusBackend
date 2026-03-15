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
exports.Tag = void 0;
const typeorm_1 = require("typeorm");
const document_entity_1 = require("../documents/document.entity");
const report_entity_1 = require("../reports/report.entity");
let Tag = class Tag {
};
exports.Tag = Tag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tag.prototype, "workspaceId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => document_entity_1.Document, (doc) => doc.tags),
    __metadata("design:type", Array)
], Tag.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => report_entity_1.Report, (rep) => rep.tags),
    __metadata("design:type", Array)
], Tag.prototype, "reports", void 0);
exports.Tag = Tag = __decorate([
    (0, typeorm_1.Entity)()
], Tag);
//# sourceMappingURL=tag.entity.js.map