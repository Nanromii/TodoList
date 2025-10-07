import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User, user => user.roles, { cascade: true })
    @JoinTable({
        name: 'users_roles_roles',
        joinColumn: { name: 'rolesId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'usersId', referencedColumnName: 'id' },
    })
    users: User[];
}