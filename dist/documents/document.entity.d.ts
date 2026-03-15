import { Subject } from "../subjects/subject.entity";
import { User } from "../users/user.entity";
import { Tag } from "../tags/tag.entity";
export declare class Document {
    id: string;
    subjectId: string;
    subject: Subject;
    title: string;
    filePath: string;
    fileSize: number;
    uploadedBy: string;
    uploader: User;
    tags: Tag[];
    originalFileName: string;
    createdAt: Date;
}
