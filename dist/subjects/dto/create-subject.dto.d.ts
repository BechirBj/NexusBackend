export declare class CreateSubjectDto {
    workspaceId: string;
    title: string;
    description?: string;
    visibility?: 'private' | 'shared' | 'public';
}
