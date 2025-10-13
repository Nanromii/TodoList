import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../utils/decorator/has-role.decorator.utils';
import type { Request } from 'express';
import { UsersService } from '../service/users.service';
import { User } from '../entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UsersService
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );
        const request: Request = context.switchToHttp().getRequest();
        const infor = request.user as { id: number; username: string; roles?: string[] };
        const id: string = request.params['id'] || request.params['userId'];

        if (!infor || !id) throw new ForbiddenException('User not authenticated.');
        if (infor.roles?.includes('ADMIN')) return true;
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const user: User = await this.userService.findUserById(Number(id));
        if (infor.username === user.username) return true;
        if (!infor.roles) return true;
        return infor.roles.some((role: string): boolean => requiredRoles.includes(role));
        //return true;
    }
}