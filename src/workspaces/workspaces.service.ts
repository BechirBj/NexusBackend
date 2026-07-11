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

interface UserPayload {
  sub: string;
  email: string;
  role: "ADMIN" | "USER";
}

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

    return workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      description: ws.description,
      ownerId: ws.ownerId,
      members: ws.members.map((m) => ({
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

  async getAdmin(id: string) {
    const ws = await this.wsRepo.findOne({ where: { id } });
    
    if (!ws) throw new NotFoundException("Workspace not found");
    return ws;
  }

  async adminGetMembers(workspaceId: string) {
    const memberships = await this.wmRepo.find({
      where: { workspaceId },
      relations: ["user"],
    });

    return memberships.map((m) => ({
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
    // memberId is the membership PK (WorkspaceMember.id), NOT userId
    const x = await this.wmRepo.find();
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException("Membership not found");

    if (member.role === "owner") {
      throw new BadRequestException("Cannot change the owner's role");
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
    const ws = await this.wsRepo.findOne({ where: { id: workspaceId } });
    if (!ws) throw new NotFoundException("Workspace not found");

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException("User not found");

    const existing = await this.wmRepo.findOne({
      where: { workspaceId, userId: user.id },
    });
    if (existing) {
      throw new BadRequestException("User is already a member of this workspace");
    }

    const membership = this.wmRepo.create({ workspaceId, userId: user.id, role });
    return this.wmRepo.save(membership);
  }

  async adminRemoveMember(memberId: string) {
    // memberId is the membership PK (WorkspaceMember.id), NOT userId
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException("Membership not found");

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
    const ids = memberships.map((m) => m.workspaceId);

    if (!ids.length) return [];
    console.log(await this.wsRepo.find({ where: { id: In(ids) } }))
    return  this.wsRepo.find({ where: { id: In(ids) } });
  }

  async create(userId: string, name: string, description: string) {
    const ws = this.wsRepo.create({ name, description, ownerId: userId });
    const saved = await this.wsRepo.save(ws);
    await this.wmRepo.save(
      this.wmRepo.create({ workspaceId: saved.id, userId, role: "owner" }),
    );
    return saved;
  }

  async get(id: string, user: UserPayload) {
    await this.ensureMember(id, user);
    const ws = await this.wsRepo.findOne({ where: { id } });
    if (!ws) throw new NotFoundException("Workspace not found");
    return ws;
  }

  async update(id: string, user: UserPayload, data: Partial<Workspace>) {
    await this.ensureOwner(id, user);
    await this.wsRepo.update(id, data);
    return this.wsRepo.findOne({ where: { id } });
  }

  async delete(id: string, user: UserPayload) {
    await this.ensureOwner(id, user);
    await this.wsRepo.delete(id);
    return { deleted: true };
  }

  async invite(
    workspaceId: string,
    user: UserPayload,
    email: string,
    role: "editor" | "viewer",
  ) {
    await this.ensureOwner(workspaceId, user);

    const invitedUser = await this.usersRepo.findOne({ where: { email } });
    if (!invitedUser) throw new NotFoundException("User not found");

    // FIX: guard against duplicate memberships
    const existing = await this.wmRepo.findOne({
      where: { workspaceId, userId: invitedUser.id },
    });
    if (existing) {
      throw new BadRequestException("User is already a member of this workspace");
    }

    const membership = this.wmRepo.create({
      workspaceId,
      userId: invitedUser.id,
      role,
    });
    return this.wmRepo.save(membership);
  }

  async updateMemberRole(
    memberId: string,
    user: UserPayload,
    role: "editor" | "viewer",
  ) {
    // memberId is the membership PK (WorkspaceMember.id), NOT userId
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException("Membership not found");

    await this.ensureOwner(member.workspaceId, user);

    if (member.role === "owner") {
      throw new BadRequestException("Cannot change the owner's role");
    }

    member.role = role;
    return this.wmRepo.save(member);
  }

  async removeMember(memberId: string, user: UserPayload) {
    // memberId is the membership PK (WorkspaceMember.id), NOT userId
    const member = await this.wmRepo.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException("Membership not found");

    await this.ensureOwner(member.workspaceId, user);

    if (member.userId === user.sub) {
      throw new BadRequestException("Cannot remove yourself from the workspace");
    }

    if (member.role === "owner") {
      throw new BadRequestException("Cannot remove the workspace owner");
    }

    // FIX: delete by the resolved PK, not the raw param
    await this.wmRepo.delete(member.id);
    return { removed: true };
  }

  async getMembers(workspaceId: string, user: UserPayload) {
    await this.ensureMember(workspaceId, user);

    const memberships = await this.wmRepo.find({
      where: { workspaceId },
      relations: ["user"],
    });

    const currentUserMembership = memberships.find((m) => m.userId === user.sub);

    return memberships.map((m) => ({
      membershipId: m.id,
      role: m.role,
      currentUserRole: currentUserMembership?.role ?? null,
      user: {
        name: m.user.name,
      },
    }));
  }

  // ===========================
  // Private Guards
  // ===========================

  private async ensureMember(workspaceId: string, user: UserPayload) {
    if (user.role === "ADMIN") return;
    const m = await this.wmRepo.findOne({
      where: { workspaceId, userId: user.sub },
    });
    if (!m) throw new ForbiddenException("Not a member of this workspace");
  }

  private async ensureOwner(workspaceId: string, user: UserPayload) {
    if (user.role === "ADMIN") return;
    const m = await this.wmRepo.findOne({
      where: { workspaceId, userId: user.sub },
    });
    if (!m || m.role !== "owner") {
      throw new ForbiddenException("Only the workspace owner can perform this action");
    }
  }
}