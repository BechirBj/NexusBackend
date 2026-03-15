export type ActivityType = 'DOCUMENT_UPLOAD' | 'REPORT_CREATE' | 'REPORT_EDIT';
export declare class Activity {
    id: string;
    workspaceId: string;
    subjectId: string;
    userId: string;
    type: ActivityType;
    metadata?: Record<string, any>;
    createdAt: Date;
}
