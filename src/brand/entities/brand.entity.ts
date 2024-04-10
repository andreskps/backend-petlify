import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text',{
        nullable: true
    }) 
    logo: string;

    @Column('text',{
        nullable: true
    })
    description: string;

    @OneToMany(() => Product, product => product.brand)
    products: Product[];


    


}
