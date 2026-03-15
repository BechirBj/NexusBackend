import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AssignTagDto } from './dto/assign-tag.dto';
export declare class TagsController {
    private service;
    constructor(service: TagsService);
    create(dto: CreateTagDto): Promise<import("./tag.entity").Tag>;
    list(workspaceId: string): Promise<import("./tag.entity").Tag[]>;
    update(id: string, dto: UpdateTagDto): Promise<import("./tag.entity").Tag>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
    assign(dto: AssignTagDto): Promise<import("../reports/report.entity").Report | import("../documents/document.entity").Document>;
}
