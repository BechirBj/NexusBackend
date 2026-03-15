import { Subject } from '../subjects/subject.entity';
import { Tag } from '../tags/tag.entity';
export type ReportStatus = 'draft' | 'final' | 'archived';
export declare class Report {
    id: string;
    subjectId: string;
    subject: Subject;
    title: string;
    content: string;
    status: ReportStatus;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}
