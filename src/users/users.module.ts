import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user';
import { UserMapper } from './mapper/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserMapper],
  controllers: [UsersController],
})
export class UsersModule {}
