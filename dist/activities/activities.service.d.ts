import { Repository } from 'typeorm';
import { Activity, ActivityType } from './activity.entity';
export declare class ActivitiesService {
    private repo;
    constructor(repo: Repository<Activity>);
    create(data: {
        workspaceId: string;
        subjectId: string;
        userId: string;
        type: ActivityType;
        metadata?: Record<string, any>;
    }): Promise<Activity>;
    listBySubject(subjectId: string): Promise<Activity[]>;
}
