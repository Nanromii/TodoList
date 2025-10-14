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

export type Subject =
    | InferSubjects<typeof User | typeof Todo | typeof Role>
    | 'all';
export type AppAbility = MongoAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: any): AppAbility {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        let isAdmin = false,
            isUser = false,
            isStaff = false;
        for (const role of user.roles) {
            if (role === 'ADMIN') {
                isAdmin = true;
            }
            if (role === 'USER') {
                isUser = true;
            }
            if (role === 'STAFF') {
                isStaff = true;
            }
        }
        if (isAdmin) {
            can(Action.MANAGE, 'all');
        } else if (isStaff) {
            can(Action.MANAGE, Todo);

            can(Action.READ, User);
            can(Action.UPDATE, User);

            can(Action.READ, Role);
        } else if (isUser) {
            can(Action.READ, Todo, { isOwner: user.username });
            can(Action.CREATE, Todo);
            can(Action.UPDATE, Todo, { isOwner: user.username });
            can(Action.DELETE, Todo, { isOwner: user.username });

            can(Action.READ, User, { username: user.username });
            can(Action.UPDATE, User, { username: user.username });
            can(Action.DELETE, User, { username: user.username });
        }
        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subject>,
        });
    }
}
