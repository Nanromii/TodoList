import { Injectable, Logger } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequest } from '../dto/request/user.request.dto';
import { UserResponse } from '../dto/response/user-response.dto';
import { PageResponse } from '../dto/response/page.response';
import { Pagination } from '../utils/pagination.utils';
import { Role } from '../entity/role.entity';
import { RefreshToken } from '../entity/refresh-token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
        private readonly mapper: UserMapper,
    ) {}

    async create(request: UserRequest): Promise<number> {
        this.logger.log(`Starting create user, username=${request.username}.`);
        const user = await this.repository.findOneBy({username : request.username});
        if (user != null) {
            this.logger.warn(`User with ${request.username} already exists.`);
            throw new Error(`User with ${request.username} already exists.`);
        }
        const entity = await this.mapper.toEntity(request);
        const curUser = await this.repository.save(entity);
        this.logger.log("Created user successfully.")
        return curUser.id;
    }

    async findOne(id: number): Promise<UserResponse> {
        this.logger.log(`Starting fetch information of user, userId=${id}.`);
        const user = await this.repository.findOneBy({ id });
        if (!user) {
            this.logger.warn(`User with id=${id} not found.`);
            throw new Error(`User with id=${id} not found.`);
        }
        this.logger.log('Fetched information of user successfully.');
        return this.mapper.toResponse(user);
    }

    findAll(page: number = 1, limit: number = 10, sort?: string[]): Promise<PageResponse<UserResponse>> {
        this.logger.log("Starting fetch information of all users.");
        const queryBuilder = this.repository.createQueryBuilder('user');
        Pagination.applySort(queryBuilder, sort, 'user');
        this.logger.log("Fetched information of all users successfully.");
        return Pagination.paginate<User, UserResponse>(queryBuilder, page, limit, (u) => this.mapper.toResponse(u));
    }

    async remove(id: number): Promise<void> {
        this.logger.log(`Starting delete user, userId=${id}.`);
        await this.repository.delete({ id });
        this.logger.log('Delete user request completed.');
    }

    async linkRole(userId: number, roleId: number): Promise<void> {
        this.logger.log(`Starting link role for user, userId=${userId}, roleId=${roleId}.`);
        const user = await this.findUserById(userId);
        const role = await this.findRoleById(roleId);
        if (!user.roles) user.roles = [];
        if (!role.users) role.users = [];
        user.roles.push(role);
        role.users.push(user);
        await this.roleRepository.save(role);
        this.logger.log(`Linked role for user successfully.`);
    }

    async unlinkRole(userId: number, roleId: number): Promise<void> {
        this.logger.log(`Starting unlink role for user, userId=${userId}, roleId=${roleId}.`);
        const user = await this.findUserById(userId);
        const role = await this.findRoleById(roleId);
        if (user.roles) {
            user.roles = user.roles.filter(r => r.id !== role.id);
        }
        if (role.users) {
            role.users = role.users.filter(u => u.id !== user.id);
        }
        await this.roleRepository.save(role);
        this.logger.log(`Unlinked role for user successfully.`);
    }

    async findRoleById(roleId: number): Promise<Role> {
        const role = await this.roleRepository.findOneBy({id: roleId});
        if (!role) {
            this.logger.warn(`Role with id=${roleId} not found.`);
            throw new Error(`Role with id=${roleId} not found.`);
        }
        return role;
    }

    async findUserById(userId: number): Promise<User> {
        const user = await this.repository.findOneBy({id: userId});
        if (!user) {
            this.logger.warn(`User with id=${userId} not found.`);
            throw new Error(`User with id=${userId} not found.`);
        }
        return user;
    }

    async findUserByUsername(username: string): Promise<User> {
        const user = await this.repository.findOneBy({username});
        if (!user) {
            this.logger.warn(`User with username=${username} not found.`);
            throw new Error(`User with username=${username} not found.`);
        }
        return user;
    }

    async saveRefreshToken(token: string, username: string): Promise<void> {
        const user = await this.findUserByUsername(username);
        const refreshToken = new RefreshToken();
        refreshToken.refreshToken = await bcrypt.hash(token, 10);
        refreshToken.createdAt = new Date();
        refreshToken.updatedAt = new Date();
        refreshToken.user = user;
        await this.refreshTokenRepository.save(refreshToken);
    }
}