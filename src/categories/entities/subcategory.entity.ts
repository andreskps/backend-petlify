import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];
}
