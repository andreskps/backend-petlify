import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text',{
    unique: true,
  })
  code: string;

  @Column('numeric', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  percentage: number;

  
  
  @Column({ type: 'numeric', precision: 10, scale: 2 ,nullable: true,
    transformer:{
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  minimumAmount: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'timestamptz' ,nullable: true })
  expiresAt: Date;

  @Column({ type: 'timestamptz' ,nullable: true })
  startsAt: Date;

  @OneToMany(() => Order, (order) => order.coupon)
    orders: Order[];
}
