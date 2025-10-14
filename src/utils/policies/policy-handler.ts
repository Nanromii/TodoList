import { Action } from '../enum/action.enum';
import { Subject } from '../../casl/casl-ability-factory';

export interface IPolicyHandler {
    action: Action;
    subject: Subject;
}