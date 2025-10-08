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
  Query, UseGuards, Req, Patch,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserRequest } from '../dto/request/user.request.dto';
import { UserResponse } from '../dto/response/user-response.dto';
import { PageResponse } from '../dto/response/page.response';
import { ApiResponse } from '../dto/response/api.response';
import { JwtAuthGuard } from '../utils/guard/jwt-auth.guard.utils';
import type { Request } from 'express';
import { RoleGuard } from '../utils/guard/has-role.guard.utils';
import { Roles } from '../utils/decorator/has-role.decorator.utils';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(private readonly userService: UsersService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('USER')
    @Get('profile')
    async myProfile(@Req() req: Request): Promise<ApiResponse<Express.User>> {
        this.logger.log("Request get my information.");
        try {
            const user = req.user;
            return new ApiResponse("Get my information successfully.", user);
        } catch (error) {
            this.logger.error(`Failed to get my information.`);
            throw new HttpException(
                new ApiResponse(`Failed to get my information.`),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post()
    async create(@Body() request: UserRequest): Promise<ApiResponse<number>> {
        this.logger.log(`Request create user, username=${request.username}`);
        try {
            const id = await this.userService.create(request);
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
            return new ApiResponse('Deleted user successfully.');
        } catch (error) {
            this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to delete user: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':userId/roles/:roleId')
    async linkRole(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request link role for user, userId=${userId}, roleId=${roleId}.`);
        try {
            await this.userService.linkRole(userId, roleId);
            return new ApiResponse(`Linked role successfully.`);
        } catch (error) {
            this.logger.error(`Failed to link role: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to link role: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':userId/roles/:roleId')
    async unlinkRole(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request unlink role for user, userId=${userId}, roleId=${roleId}.`);
        try {
            await this.userService.unlinkRole(userId, roleId);
            return new ApiResponse(`Unlinked role successfully.`);
        } catch (error) {
            this.logger.error(`Failed to unlink role: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to unlink role: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}