import { IPolicyHandler } from '../policy-handler';
import { Action } from '../../enum/action.enum';
import { User } from '../../../entity/user.entity';

export class ReadUserPolicyHandler implements IPolicyHandler {
    action = Action.READ;
    subject = User;
}

export class UpdateUserPolicyHandler implements IPolicyHandler {
    action = Action.UPDATE;
    subject = User;
}

export class DeleteUserPolicyHandler implements IPolicyHandler {
    action = Action.DELETE;
    subject = User;
}

export class ManageUserPolicyHandler implements IPolicyHandler {
    action = Action.MANAGE;
    subject = User;
}