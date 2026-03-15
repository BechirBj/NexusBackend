export declare class CreateReportDto {
    subjectId: string;
    title: string;
    content: string;
    status?: 'draft' | 'final' | 'archived';
}
