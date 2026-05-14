import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

export type ActivityType =
  | 'DOCUMENT_UPLOAD'
  | 'DOCUMENT_EDIT'
  | 'REPORT_CREATE'
  | 'REPORT_EDIT';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  subjectId: string;

  @ManyToOne(() => User)
  user: User  ;

  @Column({ type: 'varchar' })
  type: ActivityType;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
