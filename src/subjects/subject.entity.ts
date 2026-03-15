import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';
import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';

export type SubjectVisibility = 'private' | 'shared' | 'public';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @ManyToOne(() => Workspace, (ws) => ws.subjects, { onDelete: 'CASCADE' })
  workspace: Workspace;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'varchar', default: 'private' })
  visibility: SubjectVisibility;

  @OneToMany(() => Document, (doc) => doc.subject)
  documents: Document[];

  @OneToMany(() => Report, (rep) => rep.subject)
  reports: Report[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
