import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from 'src/variants/entities/product-variant.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  price: number;

  @Column('float')
  unitPrice: number;

  @Column('int')
  quantity: number;

  @Column('float')
  total: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.orderItems,
  )
  productVariant: ProductVariant;
}
