import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Document } from '../documents/document.entity';
import { Report } from '../reports/report.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  workspaceId: string;

  @ManyToMany(() => Document, (doc) => doc.tags)
  documents: Document[];

  @ManyToMany(() => Report, (rep) => rep.tags)
  reports: Report[];
}
