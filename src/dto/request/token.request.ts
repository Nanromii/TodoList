import { IsString } from 'class-validator';

export class TokenRequest {
    @IsString({message: `Token must be a string.`})
    token: string;

    constructor(token: string) {
        this.token = token;
    }
}