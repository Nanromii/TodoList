
import { TodosService } from '../service/todos.service';
import { Controller } from '@nestjs/common';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}
}
