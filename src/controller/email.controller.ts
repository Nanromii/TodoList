import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Logger,
    Post,
} from '@nestjs/common';
import { EmailService } from '../service/email.service';
import { SendEmailRequest } from '../dto/request/send-email.request';
import { ApiResponse } from '../dto/response/api.response';

@Controller('email')
export class EmailController {
    private readonly logger = new Logger(EmailController.name);
    constructor(private readonly emailService: EmailService) {}

    @Post('send')
    async send(@Body() request: SendEmailRequest): Promise<ApiResponse<void>> {
        this.logger.log('Request send email.');
        try {
            await this.emailService.sendEmail(request);
            return new ApiResponse(`Sent successfully.`);
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            throw new HttpException(
                new ApiResponse(`Failed to send email: ${error.message}`),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
