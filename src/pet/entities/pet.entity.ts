import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('boolean',{
        default:true
    })
    isActive:boolean;

    @OneToMany(() => Product, product => product.pet)
    products: Product[]
}
