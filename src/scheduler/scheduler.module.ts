import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
    imports: [MailerModule],
    providers: [SchedulerService]
})
export class SchedulerModule {}
