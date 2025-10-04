import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/Todo';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Post()
  create(@Body() body: { title: string; description?: string }): Todo {
    return this.todoService.create(body.title, body.description);
  }

  @Put('/:id')
  update(
    @Param('id') id: number,
    @Body() body: { title?: string; description?: string; isDone?: boolean },
  ): Todo {
    return this.todoService.update(
      id,
      body.title,
      body.description,
      body.isDone,
    );
  }

  @Delete('/:id')
  remove(@Param('id') id: string): void {
    return this.todoService.remove(Number(id));
  }
}
