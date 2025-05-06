import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SchedulerService {
    constructor(private readonly mailerService: MailerService){}

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async someMethod(){
        console.log('sending mail....');
        this.mailerService.sendEmails();
    }
}
