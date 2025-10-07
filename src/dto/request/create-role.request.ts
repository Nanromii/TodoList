import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateRoleRequest {
    @MaxLength(20, {
        message: (args) =>
            `Name is too long (${args.value.length} characters) - maximum allowed is ${args.constraints[0]} characters.`,
    })
    @MinLength(4, {
        message: (args) =>
            `Name is too short (${args.value.length} characters) - minimum required is ${args.constraints[0]} characters.`,
    })
    @IsString({ message: 'Name must be a string.' })
    @IsNotEmpty({ message: 'Name cannot be empty.' })
    name: string;

    @IsOptional()
    @IsString({ message: "Description must be a string." })
    @MaxLength(200, {
        message: (args) =>
            `Description is too long (${args.value.length} characters) - maximum allowed is ${args.constraints[0]} characters.`,
    })
    description?: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}