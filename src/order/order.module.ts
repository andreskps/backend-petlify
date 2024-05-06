import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrderAddress } from './entities/orderAddress.entity';
import { VariantsModule } from 'src/variants/variants.module';
import { MunicipiosModule } from 'src/municipios/municipios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderItem,OrderAddress]),VariantsModule,MunicipiosModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
