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
    UseGuards,
    Req,
    Patch,
    DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserRequest } from '../dto/request/user.request.dto';
import { UserResponse } from '../dto/response/user.response.dto';
import { PageResponse } from '../dto/response/page.response';
import { ApiResponse } from '../dto/response/api.response';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import type { Request } from 'express';
import { CheckPolicies } from '../utils/decorator/check-policies';
import { PoliciesGuard } from '../guard/policy-guard';
import {
    DeleteUserPolicyHandler,
    ManageUserPolicyHandler,
    ReadUserPolicyHandler,
} from '../utils/policies/impl/user.policies';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../utils/enum/action.enum';
import { CaslAbilityFactory } from '../casl/casl-ability-factory';
import { ManageRolePolicyHandler } from '../utils/policies/impl/role.policies';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(
        private readonly userService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    //@Roles('USER')
    @CheckPolicies(new ReadUserPolicyHandler())
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

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    //@Roles('ADMIN')
    @CheckPolicies(new ReadUserPolicyHandler())
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ): Promise<ApiResponse<UserResponse>> {
        this.logger.log(`Request fetch information of user, userId=${id}`);
        try {
            const targetUser = await this.userService.findUserById(id);
            const ability = this.caslAbilityFactory.createForUser(req.user);
            ForbiddenError.from(ability).throwUnlessCan(Action.READ, targetUser);
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

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    //@Roles('ADMIN')
    @CheckPolicies(new ManageUserPolicyHandler())
    @Get()
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('sort') sort?: string,
    ): Promise<ApiResponse<PageResponse<UserResponse>>> {
        const sortArray = sort ? sort.split(',') : [];
        this.logger.log(`Request fetch all users: page=${page}, limit=${limit}, sort=${sortArray}`);
        try {
            const result = await this.userService.findAll(page, limit, sortArray);
            return new ApiResponse('Fetched users successfully.', result);
        } catch (error) {
            this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to fetch users: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    //@Roles('ADMIN')
    @CheckPolicies(new DeleteUserPolicyHandler())
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request delete user, userId=${id}`);
        try {
            const targetUser = await this.userService.findUserById(id);
            const ability = this.caslAbilityFactory.createForUser(req.user);
            ForbiddenError.from(ability).throwUnlessCan(Action.DELETE, targetUser);
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

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    //@Roles('ADMIN')
    @CheckPolicies(new ManageUserPolicyHandler())
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

    @UseGuards(JwtAuthGuard, PoliciesGuard)
    //@Roles('ADMIN')
    @CheckPolicies(new ManageRolePolicyHandler())
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