import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability-factory';
import { CHECK_POLICIES_KEY } from '../utils/decorator/check-policies';
import { IPolicyHandler } from '../utils/policies/policy-handler';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<IPolicyHandler[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        ) || [];
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        const ability = this.caslAbilityFactory.createForUser(user);
        /*if (request.params.id) {
            const resource = await this.userService.findUserById(request.params.id);
            return policyHandlers.every(handler => {
                ForbiddenError.from(ability).throwUnlessCan(handler.action, resource);
                return true;
            });
        }*/
        return policyHandlers.every(handler => {
            ForbiddenError.from(ability).throwUnlessCan(handler.action, handler.subject);
            return true;
        });
    }
}