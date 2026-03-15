import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Workspace } from './workspace.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { User } from '../users/user.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private wsRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember) private wmRepo: Repository<WorkspaceMember>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async listForUser(userId: string) {
    const memberships = await this.wmRepo.find({ where: { userId } });
    const ids = memberships.map((m) => m.workspaceId);
    if (!ids.length) return [];
    return this.wsRepo.find({ where: { id: In(ids) } });
  }

  async create(userId: string, name: string, description?: string) {
    const ws = this.wsRepo.create({ name, description, ownerId: userId });
    const saved = await this.wsRepo.save(ws);
    await this.wmRepo.save(
      this.wmRepo.create({ workspaceId: saved.id, userId, role: 'owner' }),
    );
    return saved;
  }

  async get(id: string, userId: string) {
    await this.ensureMember(id, userId);
    return this.wsRepo.findOne({ where: { id } });
  }

  async update(id: string, userId: string, data: Partial<Workspace>) {
    await this.ensureOwner(id, userId);
    await this.wsRepo.update(id, data);
    return this.wsRepo.findOne({ where: { id } });
  }

  async delete(id: string, userId: string) {
    await this.ensureOwner(id, userId);
    await this.wsRepo.delete(id);
    return { deleted: true };
  }

  async invite(workspaceId: string, ownerId: string, email: string, role: 'editor' | 'viewer') {
    await this.ensureOwner(workspaceId, ownerId);
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const membership = this.wmRepo.create({ workspaceId, userId: user.id, role });
    return this.wmRepo.save(membership);
  }

  async updateMemberRole(memberId: string, ownerId: string, role: 'owner' | 'editor' | 'viewer') {
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException();
    await this.ensureOwner(member.workspaceId, ownerId);
    member.role = role;
    return this.wmRepo.save(member);
  }

  async removeMember(memberId: string, ownerId: string) {
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException();
    await this.ensureOwner(member.workspaceId, ownerId);
    await this.wmRepo.delete(memberId);
    return { removed: true };
  }

  private async ensureMember(workspaceId: string, userId: string) {
    const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
    if (!m) throw new ForbiddenException();
  }

  private async ensureOwner(workspaceId: string, userId: string) {
    const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
    if (!m || m.role !== 'owner') throw new ForbiddenException('Owner required');
  }
}
