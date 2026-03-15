import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';
export declare class Tag {
    id: string;
    name: string;
    workspaceId: string;
    documents: Document[];
    reports: Report[];
}
