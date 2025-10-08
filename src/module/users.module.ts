import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';
import { Role } from '../entity/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    providers: [UsersService, UserMapper],
    controllers: [UsersController],
    exports: [UsersService, UserMapper]
})
export class UsersModule {}
