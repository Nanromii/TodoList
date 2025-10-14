import {
    IPolicyHandler,
} from '../policies/policy-handler';
import { SetMetadata } from '@nestjs/common';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: IPolicyHandler[]) =>
    SetMetadata(CHECK_POLICIES_KEY, handlers);