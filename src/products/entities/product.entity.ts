import { Subcategory } from 'src/categories/entities/subcategory.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('float', {
    nullable: false,
  })
  price: number;

  @Column('float', {
    nullable: true,
  })
  priceCompare: number;

  @Column('text')
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;


  // @ManyToOne(() => User, user => user.products)
  // user: User;

  @ManyToOne(() => Subcategory, subcategory => subcategory.products)
  category: Subcategory;

  // @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  // orderDetails: OrderDetail[];

  // @OneToMany(() => Cart, cart => cart.product)
  // carts: Cart[];

  // @OneToMany(() => Review, review => review.product)
  // reviews: Review[];

  // @OneToMany(() => ProductTag, productTag => productTag.product)
  // productTags: ProductTag[];



  // @OneToMany(() => ProductAttribute, productAttribute => productAttribute.product)
  // productAttributes: ProductAttribute[];

  // @OneToMany(() => ProductDiscount, productDiscount => productDiscount.product)
  // productDiscounts: ProductDiscount[];

  // @OneToMany(() => ProductSpecification, productSpecification => productSpecification.product)
  // productSpecifications: ProductSpecification[];

  // @OneToMany(() => ProductVariant, productVariant => productVariant.product)
  // productVariants: ProductVariant[];



  // @OneToMany(() => ProductReview, productReview => productReview.product)
  // productReviews: ProductReview[];



  // @OneToMany(() => ProductTag, productTag => productTag.product)
  // productTags: ProductTag[];

  // @OneToMany(() => ProductImage, productImage => productImage.product)
  // productImages: ProductImage[];

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.replace(/\s+/g, '-').toLowerCase();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug.replace(/\s+/g, '-').toLowerCase();
  }
}
