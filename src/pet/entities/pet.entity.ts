import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @ManyToOne(() => Product, product => product.pet)
    products: Product[]
}
