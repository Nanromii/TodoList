import { Module } from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { TodosController } from '../controller/todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entities/todo';
import { User } from '../entities/user';
import { TodoMapper } from '../mapper/todo.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([Todo, User])],
    providers: [TodosService, TodoMapper],
    controllers: [TodosController],
})
export class TodosModule {}
