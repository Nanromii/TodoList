import { Module } from '@nestjs/common';
import { TodosModule } from './todos.module';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { Todo } from '../entities/todo';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'nam9mgchanh',
      database: 'todolist',
      entities: [User, Todo],
      logging: true
    }),
    TodosModule,
    UsersModule
  ],
})
export class AppModule {}
