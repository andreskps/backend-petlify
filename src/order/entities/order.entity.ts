import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/orderStatus.enum';
import { PaymentMethod } from '../enums/paymentMethod.enum';
import { OrderItem } from './orderItem.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    nullable: true,
  })
  note: string;

  @Column('float', {
    nullable: false,
  })
  totalAmount: number;

  @Column('boolean', {
    default: false,
  })
  isPaid: boolean;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderStatus,
    default: OrderStatus.Processing,
  })
  orderStatus: OrderStatus;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => Coupon, (coupon) => coupon.orders, { nullable: true })
  coupon: Coupon;
}
