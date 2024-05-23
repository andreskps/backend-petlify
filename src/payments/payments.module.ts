import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { payment } from './config/mercadoPago';
import { PaymentsController } from './payments.controller';
import { OrderModule } from 'src/order/order.module';
import { mercadoPagoConfigProvider, paymentProvider, preferenceProvider } from './providers/paymentsProvider';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    mercadoPagoConfigProvider,
    preferenceProvider,
    paymentProvider
  ],
  imports:[OrderModule],
  exports: [PaymentsService],
})
export class PaymentsModule {}
