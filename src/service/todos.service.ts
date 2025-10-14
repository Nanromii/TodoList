import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from '../entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoMapper } from '../mapper/todo.mapper';
import { CreateTodoRequest } from '../dto/request/create-todo.request';
import { TodoResponse } from '../dto/response/todo.response';
import { PageResponse } from '../dto/response/page.response';
import { Pagination } from '../utils/pagination.utils';
import { UpdateTodoRequest } from '../dto/request/update-todo.request';
import { User } from '../entity/user.entity';

@Injectable()
export class TodosService {
    private readonly logger = new Logger(TodosService.name);

    constructor(
        @InjectRepository(Todo)
        private readonly repository: Repository<Todo>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mapper: TodoMapper
    ) {}

    async create(userId: number, request: CreateTodoRequest): Promise<number> {
        this.logger.log("Starting create todo.");
        const todo = this.mapper.toEntity(request);
        const user = await this.userRepository.findOneBy({id : userId});
        if (!user) {
            this.logger.warn(`Todo with id=${userId} not found.`);
            throw Error(`Todo with id=${userId} not found.`);
        }
        todo.user = user;
        todo.isOwner = user.username;
        const curTodo = await this.repository.save(todo);
        this.logger.log("Created todo successfully.")
        return curTodo.id;
    }

    async findOne(id: number): Promise<TodoResponse> {
        this.logger.log("Starting fetch information of todo.");
        const todo = await this.repository.findOneBy({id});
        if (!todo) {
            this.logger.warn(`Todo with id=${id} not found.`);
            throw Error(`Todo with id=${id} not found.`);
        }
        this.logger.log("Fetched information of todo successfully.");
        return this.mapper.toResponse(todo);
    }

    findAll(page: number, limit: number, sort?: string[]): Promise<PageResponse<TodoResponse>> {
        this.logger.log("Starting fetch information of all todos.");
        const queryBuilder = this.repository.createQueryBuilder('todo');
        Pagination.applySort(queryBuilder, sort, 'todo');
        this.logger.log("Fetched information of all todos successfully.");
        return Pagination.paginate<Todo, TodoResponse>(queryBuilder, page, limit, (t) => this.mapper.toResponse(t));
    }

    async remove(id: number): Promise<void> {
        this.logger.log(`Starting delete todo, id=${id}.`);
        await this.repository.delete({id});
        this.logger.log("Deleted todo successfully.")
    }

    async update(id: number, request: UpdateTodoRequest): Promise<void> {
        this.logger.log(`Starting update information for todo, id=${id}.`);
        const todo = await this.repository.findOneBy({id});
        if (!todo) {
            this.logger.warn(`Todo with id=${id} not found.`);
            throw Error(`Todo with id=${id} not found.`);
        }
        todo.title = request.title;
        todo.description = request.description;
        todo.updatedAt = new Date();
        await this.repository.save(todo);
        this.logger.log("Updated information for todo successfully.");
    }

    async markAsComplete(id: number): Promise<void> {
        this.logger.log(`Starting mark todo as complete, todoId=${id}.`);
        const todo = await this.repository.findOneBy({id});
        if (!todo) {
            this.logger.warn(`Todo with id=${id} not found.`);
            throw Error(`Todo with id=${id} not found.`);
        }
        todo.isDone = true;
        await this.repository.save(todo);
        this.logger.log(`Marked todo as complete successfully, todoId=${id}.`);
    }

    async findTodoById(id: number): Promise<Todo> {
        const todo = await this.repository.findOneBy({id});
        if (!todo) {
            this.logger.warn(`Todo with id=${id} not found.`);
            throw Error(`Todo with id=${id} not found.`);
        }
        return todo;
    }
}
