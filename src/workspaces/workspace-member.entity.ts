import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';

export type WorkspaceRole = 'owner' | 'editor' | 'viewer';

@Entity()
export class WorkspaceMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  role: WorkspaceRole;

  @ManyToOne(() => Workspace, (ws) => ws.members, { onDelete: 'CASCADE' })
  workspace: Workspace;

  @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
