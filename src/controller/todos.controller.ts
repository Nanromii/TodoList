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
    Patch,
    UseGuards,
} from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { CreateTodoRequest } from '../dto/request/create-todo.request';
import { UpdateTodoRequest } from '../dto/request/update-todo.request';
import { TodoResponse } from '../dto/response/todo.response';
import { PageResponse } from '../dto/response/page.response';
import { ApiResponse } from '../dto/response/api.response';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RoleGuard } from '../guard/has-role.guard';
import { Roles } from '../utils/decorator/has-role.decorator.utils';

@Controller('todos')
export class TodosController {
    private readonly logger = new Logger(TodosController.name);
    constructor(private readonly todoService: TodosService) {}

    @Post('/:userId')
    async create(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() request: CreateTodoRequest,
    ): Promise<ApiResponse<number>> {
        this.logger.log(`Request create todo for userId=${userId}.`);
        try {
            const id = await this.todoService.create(userId, request);
            this.logger.log(`Created todo successfully, todoId=${id}.`);
            return new ApiResponse('Created todo successfully.', id);
        } catch (error) {
            this.logger.error(`Failed to create todo: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to create todo: ${error.message}`),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Get('/:id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<TodoResponse>> {
        this.logger.log(`Request fetch todo, todoId=${id}.`);
        try {
            const todo = await this.todoService.findOne(id);
            if (!todo) {
                throw new HttpException('TodoEntity not found', HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Fetched todo successfully, todoId=${id}.`);
            return new ApiResponse('Fetched todo successfully.', todo);
        } catch (error) {
            this.logger.error(`Failed to fetch todo: ${error.message}`, error.stack);
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                new ApiResponse(`Failed to fetch todo: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Get()
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
        @Query('sort') sort?: string,
    ): Promise<ApiResponse<PageResponse<TodoResponse>>> {
        this.logger.log(`Request fetch all todos: page=${page}, limit=${limit}, sort=${sort}`);
        try {
            const result = await this.todoService.findAll(page, limit, sort?.split(','));
            this.logger.log('Fetched todos successfully.');
            return new ApiResponse('Fetched todos successfully.', result);
        } catch (error) {
            this.logger.error(`Failed to fetch todos: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to fetch todos: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: UpdateTodoRequest,
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request update todo, todoId=${id}.`);
        try {
            await this.todoService.update(id, request);
            this.logger.log(`Updated todo successfully, todoId=${id}.`);
            return new ApiResponse('Updated todo successfully.');
        } catch (error) {
            this.logger.error(`Failed to update todo: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to update todo: ${error.message}`),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Patch('/:id/complete')
    async markAsComplete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request mark todo as complete, todoId=${id}.`);
        try {
            await this.todoService.markAsComplete(id);
            this.logger.log(`Marked todo as complete successfully, todoId=${id}.`);
            return new ApiResponse('Marked todo as complete successfully.');
        } catch (error) {
            this.logger.error(`Failed to mark todo complete: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to mark todo complete: ${error.message}`),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Delete('/:id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request delete todo, todoId=${id}.`);
        try {
            await this.todoService.remove(id);
            this.logger.log(`Deleted todo successfully, todoId=${id}.`);
            return new ApiResponse('Deleted todo successfully.');
        } catch (error) {
            this.logger.error(`Failed to delete todo: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to delete todo: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}