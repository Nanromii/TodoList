import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTodoRequest {
    @MaxLength(50, {
        message: (args) =>
            `Title is too long (${args.value.length} characters) - maximum allowed is ${args.constraints[0]} characters.`,
    })
    @MinLength(5, {
        message: (args) =>
            `Title is too short (${args.value.length} characters) - minimum required is ${args.constraints[0]} characters.`,
    })
    @IsString({ message: 'Title must be a string.' })
    @IsNotEmpty({ message: 'Title cannot be empty.' })
    title: string;

    @IsOptional()
    @IsString({ message: "Description must be a string." })
    @MaxLength(200, {
        message: (args) =>
            `Description is too long (${args.value.length} characters) - maximum allowed is ${args.constraints[0]} characters.`,
    })
    description?: string;

    constructor(title: string, description?: string) {
        this.title = title;
        this.description = description;
    }
}