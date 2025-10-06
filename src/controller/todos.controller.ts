import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpException,
    HttpStatus,
    Logger,
    ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { CreateTodoRequest } from '../dto/request/create-todo.request';
import { UpdateTodoRequest } from '../dto/request/update-todo.request';
import { TodoResponse } from '../dto/response/todo.response';
import { PageResponse } from '../dto/response/page.response';

@Controller('todos')
export class TodosController {
    private readonly logger = new Logger(TodosController.name);

    constructor(private readonly todoService: TodosService) {}

    @Post('/:userId')
    async create(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() request: CreateTodoRequest,
    ): Promise<number> {
        this.logger.log(`Request create todo for userId=${userId}.`);
        try {
            const id = await this.todoService.create(userId, request);
            this.logger.log(`Created todo successfully, todoId=${id}.`);
            return id;
        } catch (error) {
            this.logger.error(`Failed to create todo: ${error.message}`, error.stack);
            throw new HttpException('Failed to create todo', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/:id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoResponse> {
        this.logger.log(`Request fetch todo, todoId=${id}.`);
        try {
            return await this.todoService.findOne(id);
        } catch (error) {
            this.logger.error(`Failed to fetch todo: ${error.message}`, error.stack);
            throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('/all')
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
        @Query('sort') sort?: string,
    ): Promise<PageResponse<TodoResponse>> {
        this.logger.log(`Request fetch all todos: page=${page}, limit=${limit}, sort=${sort}`);
        try {
            const result = await this.todoService.findAll(page, limit, sort?.split(','));
            this.logger.log('Fetched todos successfully.');
            return result;
        } catch (error) {
            this.logger.error(`Failed to fetch todos: ${error.message}`, error.stack);
            throw new HttpException('Failed to fetch todos', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: UpdateTodoRequest,
    ): Promise<void> {
        this.logger.log(`Request update todo, todoId=${id}.`);
        try {
            await this.todoService.update(id, request);
            this.logger.log(`Updated todo successfully, todoId=${id}.`);
        } catch (error) {
            this.logger.error(`Failed to update todo: ${error.message}`, error.stack);
            throw new HttpException('Failed to update todo', HttpStatus.BAD_REQUEST);
        }
    }

    @Put('/:id/complete')
    async markAsComplete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        this.logger.log(`Request mark todo as complete, todoId=${id}.`);
        try {
            await this.todoService.markAsComplete(id);
            this.logger.log(`Marked todo as complete successfully, todoId=${id}.`);
        } catch (error) {
            this.logger.error(`Failed to mark todo complete: ${error.message}`, error.stack);
            throw new HttpException('Failed to mark todo complete', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        this.logger.log(`Request delete todo, todoId=${id}.`);
        try {
            this.todoService.remove(id);
            this.logger.log(`Deleted todo successfully, todoId=${id}.`);
        } catch (error) {
            this.logger.error(`Failed to delete todo: ${error.message}`, error.stack);
            throw new HttpException('Failed to delete todo', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}