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
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                connection: {
                    host: config.get<string>('REDIS_HOST'),
                    port: config.get<number>('REDIS_PORT')
                },
                defaultJobOptions: {
                    attempts: 3,
                    removeOnFail: 1000,
                    removeOnComplete: 1000
                }
            }),
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
                entities: [User, Todo, Role, RefreshToken],
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        ScheduleModule.forRoot(),
        TodosModule,
        UsersModule,
        AuthModule,
        RolesModule,
        EmailModule
    ],
    providers: [],
})
export class AppModule {}
