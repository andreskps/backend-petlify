import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { render } from '@react-email/render';
import { OrdenDetails } from 'src/order/interfaces/orderDetails.interface';


@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  public async sendEmailOrder(
    orderDetails: OrdenDetails,
  ) {
    

    // console.log("llego al servicio de email " + orderDetails.email);

    try {
      const mail = await this.mailService.sendMail({
        to: orderDetails.email,
        from: 'fernando@petlify.com',
        subject: 'Detalles de tu pedido',
        template: 'order',
        context: {
          name: 'Fernando',
          code: '1234',
          url: 'https://petlify.com',
          orderDetails: {
            ...orderDetails,
            createdAt: orderDetails.createdAt.toString(),
          },
        }
      });
    
      return {
        message: 'Email enviado',
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  
}
