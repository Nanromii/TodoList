import { Module } from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { TodosController } from '../controller/todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { User } from '../entity/user.entity';
import { TodoMapper } from '../mapper/todo.mapper';
import { UsersModule } from './users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Todo, User]), UsersModule],
    providers: [TodosService, TodoMapper],
    controllers: [TodosController],
})
export class TodosModule {}
