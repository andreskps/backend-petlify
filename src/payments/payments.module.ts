import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { payment } from './config/mercadoPago';
import { PaymentsController } from './payments.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'PAYMENT',
      useValue: payment,
    },
  ],
  imports:[OrderModule],
  exports: [PaymentsService],
})
export class PaymentsModule {}
