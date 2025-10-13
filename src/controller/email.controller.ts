import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '../dto/response/api.response';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('email')
export class EmailController {
    private readonly logger = new Logger(EmailController.name);
    constructor(
        @InjectQueue('emailQueue')
        private readonly emailQueue: Queue
    ) {}

    @Post('send')
    @UseInterceptors(FilesInterceptor('files'))
    async send(
        @Body('recipients') recipients: string,
        @Body('subject') subject: string,
        @Body('content') content: string,
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<ApiResponse<void>> {
        this.logger.log('Request send email.');
        try {
            const attachments = files?.map((file) => ({
                filename: file.originalname,
                mimetype: file.mimetype,
                content: file.buffer.toString('base64'),
            }));
            for (const recipient of recipients.trim().split(",")) {
                const to = recipient.trim();
                await this.emailQueue.add(
                    'sendEmail',
                    { to, subject, content, attachments }
                );
            }
            return new ApiResponse(`Queued successfully.`);
        } catch (error) {
            this.logger.error(`Failed to put email to queue: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to put email to queue: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
