import { User } from '../users/user.entity';
import { Subject } from '../subjects/subject.entity';
import { WorkspaceMember } from './workspace-member.entity';
export declare class Workspace {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    owner: User;
    subjects: Subject[];
    members: WorkspaceMember[];
    createdAt: Date;
    updatedAt: Date;
}
