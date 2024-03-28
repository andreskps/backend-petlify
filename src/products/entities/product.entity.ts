import { Subcategory } from 'src/categories/entities/subcategory.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Pet } from 'src/pet/entities/pet.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  // @Column('float', {
  //   nullable: false,
  // })
  // price: number;

  // @Column('float', {
  //   nullable: true,
  // })
  // priceCompare: number;

  @Column('text')
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  // @Column('int', {
  //   default: 0,
  // })
  // stock: number;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column('boolean', {
    default: false,
  })
  isPopular: boolean;

  // @ManyToOne(() => User, user => user.products)
  // user: User;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products)
  category: Subcategory;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @ManyToOne(() => Pet, (pet) => pet.products)
  pet: Pet;

  // @OneToMany(() => Review, review => review.product)
  // reviews: Review[];

  // @OneToMany(() => ProductDiscount, productDiscount => productDiscount.product)
  // productDiscounts: ProductDiscount[];

  // @OneToMany(() => ProductSpecification, productSpecification => productSpecification.product)
  // productSpecifications: ProductSpecification[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[];

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
