import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail() {
    try {
      const mail = await this.mailService.sendMail({
        to: 'pipesierra146@gmail.com',
        from: 'fernando@petlify.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'welcome to nest mailermodule',
      });


      return {
        message: 'Email enviado',
        status: 200,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
