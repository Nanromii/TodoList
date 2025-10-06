export class TodoResponse {
  id: number;
  title: string;
  description?: string;
  isDone: boolean;

  constructor(id: number, title: string, isDone: boolean, description?: string) {
    this.id = id;
    this.title = title;
    this.isDone = isDone;
    if (description !== undefined) this.description = description;
  }
}
