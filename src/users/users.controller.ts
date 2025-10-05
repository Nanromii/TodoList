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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequest } from './dto/request/user-request.dto';
import { UserResponse } from './dto/response/user-response.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() request: UserRequest): Promise<number> {
    this.logger.log(`Request create user, username=${request.username}`);
    try {
      const id = this.userService.create(request);
      this.logger.log(`Created user successfully, userId=${id}`);
      return id;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponse> {
    this.logger.log(`Request fetch information of user, userId=${id}`);
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`Fetched user successfully, userId=${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user: ${error.message}`, error.stack);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to fetch user information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Request delete user, userId=${id}`);
    try {
      await this.userService.remove(id);
      this.logger.log(`Deleted user successfully, userId=${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}