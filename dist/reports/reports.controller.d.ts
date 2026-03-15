import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
export declare class ReportsController {
    private service;
    constructor(service: ReportsService);
    create(user: {
        sub: string;
    }, dto: CreateReportDto): Promise<import("./report.entity").Report>;
    list(user: {
        sub: string;
    }, subjectId: string): Promise<import("./report.entity").Report[]>;
    get(user: {
        sub: string;
    }, id: string): Promise<import("./report.entity").Report>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateReportDto): Promise<import("./report.entity").Report>;
    delete(user: {
        sub: string;
    }, id: string): Promise<{
        deleted: boolean;
    }>;
}
