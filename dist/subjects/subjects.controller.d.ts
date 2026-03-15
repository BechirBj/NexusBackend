import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private service;
    constructor(service: SubjectsService);
    list(user: {
        sub: string;
    }): Promise<import("./subject.entity").Subject[]>;
    listByWorkspace(user: {
        sub: string;
    }, id: string): Promise<import("./subject.entity").Subject[]>;
    create(user: {
        sub: string;
    }, dto: CreateSubjectDto): Promise<import("./subject.entity").Subject>;
    get(user: {
        sub: string;
    }, id: string): Promise<import("./subject.entity").Subject>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateSubjectDto): Promise<import("./subject.entity").Subject>;
    remove(user: {
        sub: string;
    }, id: string): Promise<{
        deleted: boolean;
    }>;
}
