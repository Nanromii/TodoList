import { Module } from '@nestjs/common';
import { EmailController } from '../controller/email.controller';
import { EmailService } from '../service/email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailWorker } from '../utils/worker/email-worker.utils';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        ConfigModule,
        BullModule.registerQueue({name: 'emailQueue'})
    ],
    controllers: [EmailController],
    providers: [EmailService, EmailWorker]
})
export class EmailModule {}
