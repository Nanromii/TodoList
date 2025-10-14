import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('refreshtoken')
export class RefreshToken {
    @PrimaryColumn()
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, u => u.refreshTokens, {onDelete: "CASCADE"})
    @JoinColumn({name: 'userId'})
    user: User;
}