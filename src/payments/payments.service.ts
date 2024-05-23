import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../order/enums/paymentMethod.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject('MercadoPagoConfig') private mercadoPagoConfig: MercadoPagoConfig,
    @Inject('Preference') private preference: Preference,
    @Inject('Payment') private payment: Payment,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {

    const {idOrder} =createPaymentDto


    const order = await this.orderRepository.findOne({
      where: { id: idOrder },
    });

    if (!order) {
      throw new InternalServerErrorException('Order not found');
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      options: {
        idempotencyKey: '123',
      },
    });
    const preference = new Preference(client);
    try {
      const response = await preference.create({
        body: {
          items: [
            {
              id: order.id.toString(),
              title: 'Order',
              unit_price: order.totalAmount,
              quantity: 1,
              currency_id: 'COP',
            },
          ],
          back_urls: {
            success: `${process.env.URL_FRONTEND}/success`,
            failure: `${process.env.URL_FRONTEND}/failure`,
            pending: `${process.env.URL_FRONTEND}/pending`,
          },
          external_reference: order.id.toString(),
          auto_return: 'approved',
        },
      });

      return {
        url:response.init_point
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async webhook(query: any) {
  

    try {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
        options: {
          idempotencyKey: '123',
        },
      });

      const payment = new Payment(client);

      const id = query['data.id'];

      const response = await payment.get({
        id: id,
      });

      if(response.status !== 'approved'){
        return 'Payment not approved'
      }


      const order = await this.orderRepository.findOne({
        where: { id: parseInt(response.external_reference) },
      });

      if (!order) {
        throw new InternalServerErrorException('Order not found');
      }



      order.isPaid = true;
      // order.paymentMethod = PaymentMethod.MERCADO_PAGO;

      await this.orderRepository.save(order);


      return 'Payment approved';
  
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    } 
  }

}
