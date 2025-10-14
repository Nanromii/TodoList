import { forwardRef, Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../casl/casl-ability-factory';
import { PoliciesGuard } from '../guard/policy-guard';
import { UsersModule } from './users.module';

@Module({
    imports: [forwardRef(() => UsersModule)],
    providers: [CaslAbilityFactory, PoliciesGuard],
    exports: [CaslAbilityFactory, PoliciesGuard]
})
export class CaslModule {}