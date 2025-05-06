import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailerService {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ){}

    mailTransport(){
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
              user: this.configService.get<string>('EMAIL_USER'),
              pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });

        return transporter;
    }

    async sendEmails(){
        const allUsers = await this.usersService.findAll();
        const allGmail = allUsers.map(user => user.email).filter(mail => mail.includes('@gmail.com'));
        console.log(allGmail);

        const transport = this.mailTransport();
        const options: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: allGmail,
            subject: 'Cat Management App',
            text: `This is a reminder for to feed your cats today, if you have not done it already :)`,
        }

        try{
            await transport.sendMail(options);
            console.log('Emails sent successfully!');
        }catch(error){
            throw new Error('Error sending mails!');
        }
    }
}
