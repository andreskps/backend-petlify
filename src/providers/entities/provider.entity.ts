import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('boolean',{
        default: true
    })
    isActive: boolean;

    @OneToMany(() => Product, product => product.brand)
    products: Product[];



}
