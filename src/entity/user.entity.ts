import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Todo } from './todo.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    password: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];

    @ManyToMany(() => Role, (role) => role.users, {cascade: true, eager: true})
    @JoinTable({
        name: 'users_roles_roles',
        joinColumns: [{ name: 'usersId', referencedColumnName: 'id' }],
        inverseJoinColumns: [{ name: 'rolesId', referencedColumnName: 'id' }],
    })
    roles: Role[];
}
