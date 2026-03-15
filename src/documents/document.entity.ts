import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Subject } from "../subjects/subject.entity";
import { User } from "../users/user.entity";
import { Tag } from "../tags/tag.entity";

@Entity()
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  subjectId: string;

  @ManyToOne(() => Subject, (subject) => subject.documents, {
    onDelete: "CASCADE",
  })
  subject: Subject;

  @Column()
  title: string;

  @Column()
  filePath: string;

  @Column({ type: "int" })
  fileSize: number;

  @Column()
  uploadedBy: string; // userId

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  uploader: User;

  @ManyToMany(() => Tag, (tag) => tag.documents)
  @JoinTable()
  tags: Tag[];

  @Column({ nullable: true })
originalFileName: string;

  @CreateDateColumn()
  createdAt: Date;
}
