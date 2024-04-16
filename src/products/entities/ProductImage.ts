import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";



@Entity('productImages')
export class ProductImage{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;


    @ManyToOne(() =>Product, product => product.productImages)
    product: Product;
}