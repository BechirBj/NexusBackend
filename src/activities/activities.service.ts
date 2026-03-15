import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityType } from './activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(@InjectRepository(Activity) private repo: Repository<Activity>) {}

  // called by other services to record timeline actions
  create(data: {
    workspaceId: string;
    subjectId: string;
    userId: string;
    type: ActivityType;
    metadata?: Record<string, any>;
  }) {
    return this.repo.save(this.repo.create(data));
  }

  listBySubject(subjectId: string) {
    return this.repo.find({
      where: { subjectId },
      order: { createdAt: 'DESC' },
    });
  }
}
