import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/Todo';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException(`Todo with ${id} not found.`);
    return todo;
  }

  create(tittle: string, description?: string): Todo {
    const newTodo: Todo = {
      id: this.idCounter++,
      tittle,
      description,
      idDone: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(
    id: number,
    tittle?: string,
    description?: string,
    isDone?: boolean,
  ): Todo {
    const todo = this.findOne(id);
    if (tittle != undefined) todo.tittle = tittle;
    if (description != undefined) todo.description = description;
    if (isDone != undefined) todo.idDone = isDone;
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Todo with ${id} not found.`);
    this.todos.splice(index, 1);
  }
}
