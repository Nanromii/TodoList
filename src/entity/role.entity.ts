import {
    Column,
    CreateDateColumn,
    Entity,
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

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}