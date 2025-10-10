import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RoleService } from '../service/roles.service';
import { CreateRoleRequest } from '../dto/request/create-role.request';
import { ApiResponse } from '../dto/response/api.response';
import { RoleResponse } from '../dto/response/role.response';
import { PageResponse } from '../dto/response/page.response';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RoleGuard } from '../guard/has-role.guard';
import { Roles } from '../utils/decorator/has-role.decorator.utils';

@Controller('roles')
export class RoleController {
    private readonly logger = new Logger(RoleController.name);

    constructor(private readonly roleService: RoleService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Post()
    async create(@Body() request: CreateRoleRequest): Promise<ApiResponse<number>> {
        this.logger.log(`Request create role, name=${request.name}.`);
        try {
            const id = await this.roleService.create(request);
            return new ApiResponse(`Created role successfully.`, id);
        } catch (error) {
            this.logger.error(`Failed to create role: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to create role: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<void>> {
        this.logger.log(`Request delete role, id=${id}`);
        try {
            await this.roleService.remove(id);
            return new ApiResponse('Deleted role successfully.');
        } catch (error) {
            this.logger.error(`Failed to delete role: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to delete role: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<RoleResponse>> {
        this.logger.log(`Request fetch information of role, id=${id}.`);
        try {
            const roleResponse = await this.roleService.findOne(id);
            return new ApiResponse('Fetched information of role successfully.', roleResponse);
        } catch (error) {
            this.logger.error(`Failed to fetch information of role: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to fetch information of role: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Get()
    async findAll(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('sortBy') sortBy?: string
    ): Promise<ApiResponse<PageResponse<RoleResponse>>> {
        this.logger.log(`Request fetch information of all roles.`);
        try {
            const sortArray = sortBy ? sortBy.split(',') : [];
            const response = await this.roleService.findAll(page, limit, sortArray);
            return new ApiResponse(`Fetched information of all roles successfully.`, response);
        } catch (error) {
            this.logger.error(`Failed to fetch information of all roles: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to fetch information of all roles: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}