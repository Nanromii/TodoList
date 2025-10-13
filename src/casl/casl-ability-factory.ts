import { Injectable } from '@nestjs/common';
import {
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    InferSubjects,
    MongoAbility,
} from '@casl/ability';
import { User } from '../entity/user.entity';
import { Todo } from '../entity/todo.entity';
import { Role } from '../entity/role.entity';
import { Action } from '../utils/enum/action.enum';

type Subject = InferSubjects<typeof User | typeof Todo | typeof Role> | 'all';
export type AppAbility = MongoAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User): AppAbility {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        let isAdmin = false,
            isUser = false,
            isStaff = false;
        for (const role of user.roles) {
            if (role.name === 'ADMIN') {
                isAdmin = true;
            }
            if (role.name === 'USER') {
                isUser = true;
            }
            if (role.name === 'STAFF') {
                isStaff = true;
            }
        }
        if (isAdmin) {
            can(Action.MANAGE, 'all');
        } else if (isStaff) {
            can(Action.MANAGE, Todo);
            can(Action.READ, Role);
            can(Action.UPDATE, Role);
            cannot(Action.CREATE, Role);
            cannot(Action.DELETE, Role);
        } else if (isUser) {
            can(Action.READ, Todo, { user: { username: user.username } });
            cannot(Action.MANAGE, Role);
        }
        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subject>,
        });
    }
}
