import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailRequest } from '../dto/request/send-email.request';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly emailSender: nodemailer.Transporter;
    constructor(private readonly configService: ConfigService) {
        this.emailSender = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('EMAIL_OWNER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendEmail(request: SendEmailRequest): Promise<void> {
        this.logger.log('Starting send email.');
        await this.emailSender.sendMail({
            from: this.configService.get<string>('EMAIL_USER'),
            to: request.recipients,
            subject: request.subject,
            text: request.content,
        });
        this.logger.log(`Sent successfully.`)
    }
}
