import { RoleMapper } from '../mapper/role.mapper';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleRequest } from '../dto/request/create-role.request';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleResponse } from '../dto/response/role.response';
import { PageResponse } from '../dto/response/page.response';
import { Pagination } from '../utils/pagination.utils';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);

    constructor(
        private readonly roleMapper: RoleMapper,
        @InjectRepository(Role)
        private readonly repository: Repository<Role>
    ) {}

    async create(request: CreateRoleRequest): Promise<number> {
        let role = await this.repository.findOneBy({name: request.name});
        let id: number;
        if (!role) {
            role = await this.roleMapper.toEntity(request);
            const curRole = await this.repository.save(role);
            id = curRole.id;
        } else {
            id = role.id
        }
        this.logger.log(`Created role successfully.`);
        return id;
    }

    async remove(id: number): Promise<void> {
        this.logger.log(`Starting delete role, id=${id}.`);
        await this.repository.delete({id});
        this.logger.log(`Deleted role successfully.`);
    }

    async findOne(id: number): Promise<RoleResponse> {
        this.logger.log(`Starting fetch information of role, id=${id}.`);
        const role = await this.repository.findOneBy({id});
        if (!role) {
            this.logger.log(`Role with id=${id} not exist.`);
            throw new NotFoundException(`Role with id=${id} not exist.`);
        }
        this.logger.log(`Fetched information successfully.`);
        return this.roleMapper.toResponse(role);
    }

    findAll(page: number = 1, limit: number = 10, sortBy?: string[]): Promise<PageResponse<RoleResponse>> {
        this.logger.log("Starting fetch information of all roles.");
        const queryBuilder = this.repository.createQueryBuilder('role');
        Pagination.applySort(queryBuilder, sortBy, 'role');
        this.logger.log("Fetched information of all roles successfully.");
        return Pagination.paginate<Role, RoleResponse>(queryBuilder, page, limit, (role) => this.roleMapper.toResponse(role));
    }
}