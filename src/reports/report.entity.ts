import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { Tag } from '../tags/tag.entity';

export type ReportStatus = 'draft' | 'final' | 'archived';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subjectId: string;

  @ManyToOne(() => Subject, (subject) => subject.reports, { onDelete: 'CASCADE' })
  subject: Subject;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', default: 'draft' })
  status: ReportStatus;

  @ManyToMany(() => Tag, (tag) => tag.reports)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
