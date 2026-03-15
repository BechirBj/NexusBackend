import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type ActivityType = 'DOCUMENT_UPLOAD' | 'REPORT_CREATE' | 'REPORT_EDIT';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  subjectId: string;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  type: ActivityType;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
