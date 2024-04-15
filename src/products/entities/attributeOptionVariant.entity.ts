// attributeOptionSku.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductVariant } from '../../variants/entities/product-variant.entity';
import { AttributeOption } from './attribute-option.entity';

@Entity()
export class AttributeOptionVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AttributeOption)
  option: AttributeOption;

  @ManyToOne(() => ProductVariant)
  variant: ProductVariant;
}
