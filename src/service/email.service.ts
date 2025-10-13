import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { Cron } from '@nestjs/schedule';

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

    @Cron('0 0 * * *')
    async cleanUploads(): Promise<void> {
        this.logger.log(`Starting clean the Uploads.`);
        const files = await fs.readdir('./uploads');
        for (const file of files) {
            await fs.unlink(`./uploads/${file}`)
        }
        this.logger.log(`Cleaned successfully.`);
    }
}