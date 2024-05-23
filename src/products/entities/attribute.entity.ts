
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttributeOption } from './attribute-option.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => AttributeOption, option => option.attribute)
  options: AttributeOption[];
}
