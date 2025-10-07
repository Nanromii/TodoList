import { Module } from '@nestjs/common';
import { TodosModule } from './todos.module';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { Todo } from '../entities/todo';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';

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
            entities: [User, Todo],
            autoLoadEntities: true,
            synchronize: true,
        }),
        TodosModule,
        UsersModule,
        AuthModule
    ],
})
export class AppModule {}
