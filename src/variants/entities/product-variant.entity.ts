// variant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { AttributeOption } from '../../products/entities/attribute-option.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal'})
  price: number;

  @Column()
  stock: number;

  @ManyToOne(() => Product, product => product.productVariants)
  product: Product;


  @Column('boolean',{
    default: true,
  })
  isActive: boolean;
  
  @ManyToOne(() => AttributeOption, attributeOption => attributeOption.productVariants)
  option: AttributeOption;
  

  @OneToMany(() => OrderItem, orderItem => orderItem.productVariant)
  orderItems: OrderItem[];
}
