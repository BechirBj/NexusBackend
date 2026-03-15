import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private service;
    constructor(service: ActivitiesService);
    list(subjectId: string): Promise<import("./activity.entity").Activity[]>;
}
