import { IPolicyHandler } from '../policy-handler';
import { Action } from '../../enum/action.enum';
import { Todo } from '../../../entity/todo.entity';

export class ReadTodoPolicyHandler implements IPolicyHandler {
    action = Action.READ;
    subject = Todo;
}

export class UpdateTodoPolicyHandler implements IPolicyHandler {
    action = Action.UPDATE;
    subject = Todo;
}

export class DeleteTodoPolicyHandler implements IPolicyHandler {
    action = Action.DELETE;
    subject = Todo;
}

export class ManageTodoPolicyHandler implements IPolicyHandler {
    action = Action.MANAGE;
    subject = Todo;
}