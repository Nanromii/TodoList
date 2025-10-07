import { RoleMapper } from '../mapper/role.mapper';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleRequest } from '../dto/request/create-role.request';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../entity/user.entity';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);

    constructor(
        private readonly roleMapper: RoleMapper,
        @InjectRepository(Role)
        private readonly repository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(request: CreateRoleRequest, userId: number): Promise<number> {
        this.logger.log(`Starting create role, name=${request.name}.`);
        const user = await this.userRepository.findOneBy({id: userId});
        if (!user) {
            this.logger.log(`User with id=${userId} not exist.`);
            throw new NotFoundException(`User with id=${userId} not exist.`);
        }
        const role = await this.roleMapper.toEntity(request);
        role.users.push(user);
        const curRole = await this.repository.save(role);
        this.logger.log(`Created role successfully.`);
        return curRole.id;
    }

    async remove(id: number): Promise<void> {
        this.logger.log(`Starting delete role, id=${id}.`);
        await this.repository.delete({id});
        this.logger.log(`Deleted role successfully.`);
    }

    findOne() {

    }

    findAll() {

    }
}