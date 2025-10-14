import { IPolicyHandler } from '../policy-handler';
import { Action } from '../../enum/action.enum';
import { Role } from '../../../entity/role.entity';

export class ReadRolePolicyHandler implements IPolicyHandler {
    action = Action.READ;
    subject = Role;
}

export class UpdateRolePolicyHandler implements IPolicyHandler {
    action = Action.UPDATE;
    subject = Role;
}

export class DeleteRolePolicyHandler implements IPolicyHandler {
    action = Action.DELETE;
    subject = Role;
}

export class ManageRolePolicyHandler implements IPolicyHandler {
    action = Action.MANAGE;
    subject = Role;
}

export class CreateRolePolicyHandler implements IPolicyHandler {
    action = Action.MANAGE;
    subject = Role;
}