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
            `Title quá dài (${args.value.length} ký tự) - tối đa chỉ được ${args.constraints[0]} ký tự.`,
    })
    @MinLength(5, {
        message: (args) =>
            `Title quá ngắn (${args.value.length} ký tự) - tối thiểu là ${args.constraints[0]} ký tự.`
    })
    @IsString({message: "Title phải là một chuỗi kí tự."})
    @IsNotEmpty({message: "Title không được để trống."})
    title: string;

    @IsOptional()
    @IsString({ message: "Description phải là chuỗi ký tự." })
    @MaxLength(200, { message: "Description tối đa 200 ký tự." })
    description?: string;

    constructor(title: string, description?: string) {
        this.title = title;
        this.description = description;
    }
}