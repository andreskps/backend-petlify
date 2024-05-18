import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrderAddress } from './entities/orderAddress.entity';
import { VariantsModule } from 'src/variants/variants.module';
import { MunicipiosModule } from 'src/municipios/municipios.module';
import { CouponsModule } from 'src/coupons/coupons.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderItem,OrderAddress]),VariantsModule,MunicipiosModule,CouponsModule,AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService,TypeOrmModule]
})
export class OrderModule {}
