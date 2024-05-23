// attributeOption.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { AttributeOptionVariant } from './attributeOptionVariant.entity';
import { ProductVariant } from '../../variants/entities/product-variant.entity';

@Entity()
export class AttributeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.options)
  attribute: Attribute;

  // @OneToMany(
  //   () => AttributeOptionVariant,
  //   (attributeOptionVariant) => attributeOptionVariant.option,
  // )
  // attributeOptionVariants: AttributeOptionVariant[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.option)
  productVariants: ProductVariant[];  
}
