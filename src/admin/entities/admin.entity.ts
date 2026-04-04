import { UserRole } from 'src/enums/user-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('admin')
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    nom: string;
    @Column()
    prenom: string;
    @Column()
    username: string;
    @Column({unique: true})
    email: string;
    @Column()
    password: string;
    @Column({type: 'enum', enum: UserRole, default: UserRole.ADMIN})
    role: UserRole;

}
