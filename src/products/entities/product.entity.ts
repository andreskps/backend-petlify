import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from '../../variants/entities/product-variant.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import { Review } from 'src/review/entities/review.entity';

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

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column('boolean', {
    default: false,
  })
  isPopular: boolean;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products,{
    onDelete: 'SET NULL',
  })
  subCategory: Subcategory;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @ManyToOne(() => Pet, (pet) => pet.products)
  pet: Pet;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  // @OneToMany(() => ProductDiscount, productDiscount => productDiscount.product)
  // productDiscounts: ProductDiscount[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[];

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
