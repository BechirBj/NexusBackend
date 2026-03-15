import { Workspace } from '../workspaces/workspace.entity';
import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';
export type SubjectVisibility = 'private' | 'shared' | 'public';
export declare class Subject {
    id: string;
    workspaceId: string;
    workspace: Workspace;
    title: string;
    description?: string;
    visibility: SubjectVisibility;
    documents: Document[];
    reports: Report[];
    createdAt: Date;
    updatedAt: Date;
}
