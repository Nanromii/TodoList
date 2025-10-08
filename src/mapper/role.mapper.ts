import { Role } from '../entity/role.entity';
import { RoleResponse } from '../dto/response/role.response';
import { CreateRoleRequest } from '../dto/request/create-role.request';

export class RoleMapper {
    toResponse(entity: Role): RoleResponse {
        return new RoleResponse(entity.name, entity.description);
    }

    async toEntity(request: CreateRoleRequest): Promise<Role> {
        const role = new Role();
        role.name = request.name;
        role.description = request.description;
        role.users = [];
        return role;
    }
}