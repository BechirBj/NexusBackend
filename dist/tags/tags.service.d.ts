import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';
export declare class TagsService {
    private repo;
    private docRepo;
    private repRepo;
    constructor(repo: Repository<Tag>, docRepo: Repository<Document>, repRepo: Repository<Report>);
    create(data: Partial<Tag>): Promise<Tag>;
    listByWorkspace(workspaceId: string): Promise<Tag[]>;
    update(id: string, data: Partial<Tag>): Promise<Tag>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
    assign(tagId: string, targetType: 'document' | 'report', targetId: string): Promise<Report | Document>;
}
