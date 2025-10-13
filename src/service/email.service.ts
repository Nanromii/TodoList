import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

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

    async sendEmail(
        to: string,
        subject: string,
        text: string,
        attachments?: { filename: string; content: Buffer }[],
    ): Promise<void> {
        this.logger.log('Starting send email.');
        await this.emailSender.sendMail({
            from: this.configService.get<string>('EMAIL_USER'),
            to,
            subject,
            text,
            attachments,
        });
        this.logger.log('Sent successfully.');
    }
}
