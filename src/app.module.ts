import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user';
import { Todo } from './todos/entity/todo';

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
