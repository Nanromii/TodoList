import { Injectable, Logger } from '@nestjs/common';
import { UserMapper } from '../mapper/user.mapper';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequest } from '../dto/request/user.request.dto';
import { UserResponse } from '../dto/response/user-response.dto';
import { PageResponse } from '../dto/response/page.response';
import { Pagination } from '../utils/pagination.utils';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
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

    async findUserByUsername(username: string): Promise<User> {
        const user = await this.repository.findOneBy({username});
        if (!user) {
            this.logger.warn(`User with username=${username} not found.`);
            throw new Error(`User with username=${username} not found.`);
        }
        return user;
    }
}