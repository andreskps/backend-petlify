import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('numeric', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  percentage: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'timestamptz' ,nullable: true})
  expiresAt: Date;

  @Column({ type: 'timestamptz' ,nullable: true})
  startsAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => Product, (product) => product.discount)
  products: Product[];

  // @ManyToMany(() => User, (user) => user.discounts)
  // users: User[];
}
