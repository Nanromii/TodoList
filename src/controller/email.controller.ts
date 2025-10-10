import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Logger,
    Post,
} from '@nestjs/common';
import { SendEmailRequest } from '../dto/request/send-email.request';
import { ApiResponse } from '../dto/response/api.response';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('email')
export class EmailController {
    private readonly logger = new Logger(EmailController.name);
    constructor(
        @InjectQueue('emailQueue')
        private readonly emailQueue: Queue
    ) {}

    @Post('send')
    async send(@Body() request: SendEmailRequest): Promise<ApiResponse<void>> {
        this.logger.log('Request send email.');
        try {
            const { recipients, subject, content } = request;
            for (const recipient of recipients) {
                await this.emailQueue.add(
                    'sendEmail',
                    { recipient, subject, content }
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
