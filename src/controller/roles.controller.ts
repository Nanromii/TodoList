import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { RoleService } from '../service/roles.service';
import { CreateRoleRequest } from '../dto/request/create-role.request';
import { ApiResponse } from '../dto/response/api.response';

@Controller('roles')
export class RoleController {
    private readonly logger = new Logger(RoleController.name);

    constructor(private readonly roleService: RoleService) {}

    @Post()
    async create(
        @Body() request: CreateRoleRequest,
        @Query('id', ParseIntPipe) userId: number
    ): Promise<ApiResponse<number>> {
        this.logger.log(`Request create role, name=${request.name}.`);
        try {
            const id = await this.roleService.create(request, userId);
            return new ApiResponse(`Created role successfully.`, id);
        } catch (error) {
            this.logger.error(`Failed to create role: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to create role: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

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
}