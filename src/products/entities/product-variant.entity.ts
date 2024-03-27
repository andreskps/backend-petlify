// variant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { AttributeOptionVariant } from './attributeOptionVariant.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @ManyToOne(() => Product, product => product.productVariants)
  product: Product;

  @OneToMany(() => AttributeOptionVariant, attributeOptionVariant => attributeOptionVariant.variant)
  attributeOptionVariants: AttributeOptionVariant[];
}
