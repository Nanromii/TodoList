import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { RoleService } from '../service/roles.service';
import { RoleController } from '../controller/roles.controller';
import { RoleMapper } from '../mapper/role.mapper';
import { User } from '../entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role, User])],
    providers: [RoleService, RoleMapper],
    controllers: [RoleController]
})
export class RolesModule {}