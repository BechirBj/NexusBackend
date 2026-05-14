import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Activity, ActivityType } from "./activity.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private repo: Repository<Activity>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}


  async create(data: {
    workspaceId: string;
    subjectId: string;
    userId: string;
    type: ActivityType;
    metadata?: Record<string, any>;
  }) {
    const user = await this.userRepo.findOne({
      where: { id: data.userId },
    });

    if (!user) throw new NotFoundException("User not found");
    return this.repo.save(
      this.repo.create({
        workspaceId: data.workspaceId,
        subjectId: data.subjectId,
        user:user,
        type: data.type,
        metadata: data.metadata,
      }),
    );
  }

  async listBySubject(subjectId: string) {
    const activities = await this.repo.find({
      where: { subjectId },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
 
    return  activities.map((a) => ({
      username : a.user.name,
      type: a.type,
      metadata: a.metadata,
      createdAt: a.createdAt,
    }));
  }
}
