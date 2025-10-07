import { Module } from '@nestjs/common';
import { TodosModule } from './todos.module';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Todo } from '../entity/todo.entity';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { Role } from '../entity/role.entity';
import { RolesModule } from './roles.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User, Todo, Role],
            autoLoadEntities: true,
            synchronize: true,
        }),
        TodosModule,
        UsersModule,
        AuthModule,
        RolesModule
    ],
})
export class AppModule {}
