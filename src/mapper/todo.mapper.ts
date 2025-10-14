import { Injectable } from '@nestjs/common';
import { TodoResponse } from '../dto/response/todo.response';
import { Todo } from '../entity/todo.entity';
import { CreateTodoRequest } from '../dto/request/create-todo.request';

@Injectable()
export class TodoMapper {
    toResponse(todo: Todo): TodoResponse {
        const isDone = todo.isDone ? "Done." : "In process.";
        return new TodoResponse(todo.id, todo.title, isDone, todo.description);
    }

    toEntity(request: CreateTodoRequest): Todo {
        const entity = new Todo();
        entity.title = request.title;
        entity.description = request.description;
        entity.isDone = false;
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        return entity;
    }
}