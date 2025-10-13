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
        const { to, subject, content, attachments } = job.data;
        await this.emailService.sendEmail(to, subject, content, attachments);
    }

    @OnWorkerEvent('active')
    onActive(job: Job): void {
        this.logger.log(`Job #${job.id} started (to: ${job.data.to})`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job): void {
        this.logger.log(`Job #${job.id} completed (to: ${job.data.to})`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, err: Error): void {
        this.logger.error(`Job #${job.id} failed: ${err.message}`);
    }
}