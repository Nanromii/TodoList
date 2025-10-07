import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongPasswordDecorator } from '../../utils/decorator/strongpassword-decorator.utils';

export class UserRequest {
    @MaxLength(50, {
        message: (args) =>
            `Username is too long (${args.value.length} characters) - maximum allowed is ${args.constraints[0]} characters.`,
    })
    @MinLength(5, {
        message: (args) =>
            `Username is too short (${args.value.length} characters) - minimum required is ${args.constraints[0]} characters.`,
    })
    @IsString({ message: 'Username must be a string.' })
    @IsNotEmpty({ message: 'Username cannot be empty.' })
    username: string;

    @IsStrongPasswordDecorator()
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
