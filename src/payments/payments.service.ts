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
            success: 'localhost:3000/success',
            failure: 'localhost:3000/failure',
            pending: 'localhost:3000/pending',
          },
          external_reference: order.id.toString(),
          auto_return: 'approved',
        },
      });

      return response;
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

      console.log(response.external_reference);

      const order = await this.orderRepository.findOne({
        where: { id: parseInt(response.external_reference) },
      });
      console.log(order)


      order.isPaid = true;
      order.paymentMethod = PaymentMethod.CREDIT_CARD;

      await this.orderRepository.save(order);


      return 'Payment approved';
  
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    } 
   
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
