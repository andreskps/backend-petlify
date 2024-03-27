// attributeOption.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity()
export class AttributeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

    @ManyToOne(() => Attribute, attribute => attribute.options)
    attribute: Attribute;
    
}
