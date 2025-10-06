import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRequest {
    @MaxLength(20, {
        message: (args) =>
            `Title quá dài (${args.value.length} ký tự) - tối đa chỉ được ${args.constraints[0]} ký tự.`,
    })
    @MinLength(6, {
        message: (args) =>
            `Title quá ngắn (${args.value.length} ký tự) - tối thiểu là ${args.constraints[0]} ký tự.`
    })
    @IsString({message: "Title phải là một chuỗi kí tự."})
    @IsNotEmpty({message: "Title không được để trống."})
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}