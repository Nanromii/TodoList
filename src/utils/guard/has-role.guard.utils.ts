import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/has-role.decorator.utils';
import type { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );
        if (!requiredRoles || requiredRoles.length === 0) return true;
        const req: Request = context.switchToHttp().getRequest();
        const user = req.user as { roles?: string[] };
        if (!user || !Array.isArray(user.roles)) return false;
        return user.roles.some(role => requiredRoles.includes(role));
    }
}