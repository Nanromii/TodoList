import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { RoleService } from '../service/roles.service';
import { RoleController } from '../controller/roles.controller';
import { RoleMapper } from '../mapper/role.mapper';
import { UsersModule } from './users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
        UsersModule
    ],
    providers: [RoleService, RoleMapper],
    controllers: [RoleController]
})
export class RolesModule {}