import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { User } from "../users/user.entity";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private wsRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember) private wmRepo: Repository<WorkspaceMember>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  // ===========================
  // Admin Endpoints
  // ===========================

  async adminList() {
    const workspaces = await this.wsRepo.find({
      relations: ["members", "members.user"],
    });

    return workspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      description: ws.description,
      ownerId: ws.ownerId,
      members: ws.members.map(m => ({
        membershipId: m.id,
        userId: m.userId,
        role: m.role,
        user: {
          id: m.user.id,
          email: m.user.email,
          name: m.user.name,
        },
      })),
    }));
  }

  async adminGetMembers(workspaceId: string) {
    const memberships = await this.wmRepo.find({ where: { workspaceId }, relations: ["user"] });
    return memberships.map(m => ({
      membershipId: m.id,
      userId: m.userId,
      role: m.role,
      user: {
        id: m.user.id,
        email: m.user.email,
        name: m.user.name,
      },
    }));
  }

async adminUpdateMemberRole(memberId: string, role: "editor" | "viewer") {
  console.log("Admin updating member role:", { memberId, role });

  // Look up by membership ID, NOT userId
  const member = await this.wmRepo.findOne({ where: { userId: memberId } });
  console.log("Found member for admin update:", member);
  if (!member) throw new NotFoundException("Member not found");

  // Optional: prevent changing the workspace owner
  if (member.role === "owner") {
    throw new BadRequestException("Cannot change the owner's role via admin");
  }

  member.role = role;

  try {
    return await this.wmRepo.save(member);
  } catch (err) {
    console.error("Failed to update member role:", err);
    throw new InternalServerErrorException("Failed to update member role");
  }
}


async adminInvite(workspaceId: string, email: string, role: "editor" | "viewer") {
  // find the user by email
  const user = await this.usersRepo.findOne({ where: { email } });
  if (!user) throw new NotFoundException("User not found");

  // check if already a member
  const existing = await this.wmRepo.findOne({ where: { workspaceId, userId: user.id } });
  if (existing) {
    throw new BadRequestException("User is already a member of this workspace");
  }

  const membership = this.wmRepo.create({
    workspaceId,
    userId: user.id,
    role,
  });

  return this.wmRepo.save(membership);
}

async adminRemoveMember(memberId: string) {
  const member = await this.wmRepo.findOne({ where: { userId: memberId } });
  console.log("Found member for admin removal:", member);
  if (!member) throw new NotFoundException("Member not found");

  if (member.role === "owner") {
    throw new BadRequestException("Cannot remove the workspace owner");
  }

  await this.wmRepo.delete(member.id);
  return { removed: true };
}




  // ===========================
  // Owner / Member Endpoints 
  // ===========================

  async listForUser(userId: string) {
    const memberships = await this.wmRepo.find({ where: { userId } });
    const ids = memberships.map(m => m.workspaceId);
    if (!ids.length) return [];
    return this.wsRepo.find({ where: { id: In(ids) } });
  }

  async create(userId: string, name: string, description?: string) {
    const ws = this.wsRepo.create({ name, description, ownerId: userId });
    const saved = await this.wsRepo.save(ws);
    await this.wmRepo.save(
      this.wmRepo.create({ workspaceId: saved.id, userId, role: "owner" }),
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

  async invite(workspaceId: string, ownerId: string, email: string, role: "editor" | "viewer") {
    await this.ensureOwner(workspaceId, ownerId);
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException("User not found");

    const membership = this.wmRepo.create({ workspaceId, userId: user.id, role });
    return this.wmRepo.save(membership);
  }

  async updateMemberRole(memberId: string, ownerId: string, role: "editor" | "viewer") {
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException("Member not found");
    await this.ensureOwner(member.workspaceId, ownerId);

    member.role = role;
    return this.wmRepo.save(member);
  }

  async removeMember(memberId: string, ownerId: string) {
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException("Member not found");

    await this.ensureOwner(member.workspaceId, ownerId);
    if (member.userId === ownerId) throw new BadRequestException("Cannot remove yourself");
    await this.wmRepo.delete(memberId);
    return { removed: true };
  }

  async getMembers(workspaceId: string, userId: string) {
    await this.ensureMember(workspaceId, userId);
    const memberships = await this.wmRepo.find({ where: { workspaceId } });
    const userIds = memberships.map(m => m.userId);
    const users = await this.usersRepo.findByIds(userIds);

    return memberships.map(m => ({
      membershipId: m.id,
      userId: m.userId,
      role: m.role,
      currentUserRole: memberships.find(x => x.userId === userId)?.role || "member",
      ...users.find(u => u.id === m.userId),
    }));
  }

  // ===========================
  // Guards
  // ===========================

  private async ensureMember(workspaceId: string, userId: string) {
    const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
    if (!m) throw new ForbiddenException("Not a member of this workspace");
  }

  private async ensureOwner(workspaceId: string, userId: string) {
    const m = await this.wmRepo.findOne({ where: { workspaceId, userId } });
    if (!m || m.role !== "owner") throw new ForbiddenException("Owner required");
  }
}