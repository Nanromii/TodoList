import { Module } from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { TodosController } from '../controller/todos.controller';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
