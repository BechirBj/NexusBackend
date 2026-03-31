import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentTitleDto } from './dto/update-document-title.dto';
export declare class DocumentsController {
    private service;
    constructor(service: DocumentsService);
    upload(user: {
        sub: string;
    }, file: Express.Multer.File, dto: UploadDocumentDto): Promise<import("./document.entity").Document>;
    list(user: {
        sub: string;
    }, subjectId: string): Promise<import("./document.entity").Document[]>;
    updateTitle(user: {
        sub: string;
    }, id: string, dto: UpdateDocumentTitleDto): Promise<import("./document.entity").Document>;
    delete(user: {
        sub: string;
    }, id: string): Promise<{
        deleted: boolean;
    }>;
}
