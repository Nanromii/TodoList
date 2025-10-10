import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../../service/email.service';
import { Logger } from '@nestjs/common';

@Processor('emailQueue')
export class EmailWorker extends WorkerHost {
    private readonly logger = new Logger(EmailWorker.name);
    constructor(private readonly emailService: EmailService) {
        super();
    }

    async process(job: Job): Promise<void> {
        const { recipient, subject, content } = job.data;
        await this.emailService.sendEmail(recipient, subject, content);
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.log(`Job #${job.id} started (to: ${job.data.recipient})`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`Job #${job.id} completed (to: ${job.data.recipient})`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, err: Error) {
        this.logger.error(`Job #${job.id} failed: ${err.message}`);
    }
}