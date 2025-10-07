import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
    @IsString({ message: 'Username must be a string.' })
    @IsNotEmpty({ message: 'Username cannot be empty.' })
    username: string;

    @IsString({ message: 'Password must be a string.' })
    @IsNotEmpty({ message: 'Password cannot be empty.' })
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
