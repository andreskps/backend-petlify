import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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



  // @ManyToOne(() => User, user => user.products)
  // user: User;

  // @ManyToOne(() => Category, category => category.products)
  // category: Category;

  // @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  // orderDetails: OrderDetail[];

  // @OneToMany(() => Cart, cart => cart.product)
  // carts: Cart[];

  // @OneToMany(() => Review, review => review.product)
  // reviews: Review[];

  // @OneToMany(() => WishList, wishList => wishList.product)
  // wishLists: WishList[];

  // @OneToMany(() => ProductTag, productTag => productTag.product)
  // productTags: ProductTag[];

  // @OneToMany(() => ProductImage, productImage => productImage.product)
  // productImages: ProductImage[];

  // @OneToMany(() => ProductAttribute, productAttribute => productAttribute.product)
  // productAttributes: ProductAttribute[];

  // @OneToMany(() => ProductDiscount, productDiscount => productDiscount.product)
  // productDiscounts: ProductDiscount[];

  // @OneToMany(() => ProductSpecification, productSpecification => productSpecification.product)
  // productSpecifications: ProductSpecification[];

  // @OneToMany(() => ProductVariant, productVariant => productVariant.product)
  // productVariants: ProductVariant[];

  // @OneToMany(() => ProductOption, productOption => productOption.product)
  // productOptions: ProductOption[];

  // @OneToMany(() => ProductReview, productReview => productReview.product)
  // productReviews: ProductReview[];

  // @OneToMany(() => ProductCategory, productCategory => productCategory.product)
  // productCategories: ProductCategory[];

  // @OneToMany(() => ProductAttribute, productAttribute => productAttribute.product)
  // productAttributes: ProductAttribute[];

  // @OneToMany(() => ProductTag, productTag => productTag.product)
  // productTags: ProductTag[];

  // @OneToMany(() => ProductImage, productImage => productImage.product)
  // productImages: ProductImage[];
}
