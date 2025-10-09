import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailRequest {
    @IsEmail({}, {each: true})
    @IsNotEmpty()
    recipients: string[];

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    constructor(recipients: string[], subject: string, content: string) {
        this.recipients = recipients;
        this.subject = subject;
        this.content = content;
    }
}