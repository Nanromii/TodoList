import { Module } from '@nestjs/common';
import { TodosModule } from './todos.module';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Todo } from '../entity/todo.entity';
import { AuthModule } from './auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from '../entity/role.entity';
import { RolesModule } from './roles.module';
import { RefreshToken } from '../entity/refresh-token.entity';
import { EmailModule } from './email.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get<string>('DB_HOST'),
                port: +config.get('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
                entities: [User, Todo, Role, RefreshToken],
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        TodosModule,
        UsersModule,
        AuthModule,
        RolesModule,
        EmailModule
    ],
    providers: [],
})
export class AppModule {}
