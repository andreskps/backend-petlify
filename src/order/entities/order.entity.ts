import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/orderStatus.enum';
import { PaymentMethod } from '../enums/paymentMethod.enum';

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
    enum:PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn()
  createdDate: Date;

  
  @UpdateDateColumn()
  updatedDate: Date;
}
