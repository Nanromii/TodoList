import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Logger,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserRequest } from '../dto/request/user-request.dto';
import { UserResponse } from '../dto/response/user-response.dto';
import { PageResponse } from '../dto/response/page.response';
import { ApiResponse } from '../dto/response/api.response';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(private readonly userService: UsersService) {}

    @Post()
    async create(@Body() request: UserRequest): Promise<ApiResponse<number>> {
        this.logger.log(`Request create user, username=${request.username}`);
        try {
            const id = await this.userService.create(request);
            this.logger.log(`Created user successfully, userId=${id}`);
            return new ApiResponse("Created user successfully.", id);
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to create user: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('/:id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<UserResponse>> {
        this.logger.log(`Request fetch information of user, userId=${id}`);
        try {
            const user = await this.userService.findOne(id);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Fetched user successfully, userId=${id}`);
            return new ApiResponse('Fetched user successfully.', user);
        } catch (error) {
            this.logger.error(`Failed to fetch user: ${error.message}`, error.stack);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                new ApiResponse(`Failed to fetch user information: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sort') sort?: string,
    ): Promise<ApiResponse<PageResponse<UserResponse>>> {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const sortArray = sort ? sort.split(',') : [];
        this.logger.log(`Request fetch all users: page=${pageNum}, limit=${limitNum}, sort=${sortArray}`,);
        try {
            const result = await this.userService.findAll(pageNum, limitNum, sortArray);
            this.logger.log('Fetched users successfully.');
            return new ApiResponse('Fetched users successfully.', result);
        } catch (error) {
            this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to fetch users: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request delete user, userId=${id}`);
        try {
            await this.userService.remove(id);
            this.logger.log(`Deleted user successfully, userId=${id}`);
            return new ApiResponse('Deleted user successfully.');
        } catch (error) {
            this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to delete user: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}