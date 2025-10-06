import { Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { UserMapper } from '../mapper/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserMapper],
  controllers: [UsersController],
})
export class UsersModule {}
