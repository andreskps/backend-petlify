import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  code: string;

  @Column('decimal', {
    nullable: false,
  })
  percentage: number;

  @Column('decimal', {
    nullable: true,
  })
  minimumAmount: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz' })
  startsAt: Date;

  @OneToMany(() => Order, (order) => order.coupon)
    orders: Order[];
}
