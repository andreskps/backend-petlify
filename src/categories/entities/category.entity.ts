import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}
