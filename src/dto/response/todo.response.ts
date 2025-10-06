export class TodoResponse {
  id: number;
  title: string;
  description?: string;
  isDone: string;

  constructor(id: number, title: string, isDone: string, description?: string) {
    this.id = id;
    this.title = title;
    this.isDone = isDone;
    if (description !== undefined) this.description = description;
  }
}
