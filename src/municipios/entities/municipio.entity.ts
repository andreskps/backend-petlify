import { Departamento } from 'src/departamentos/entities/departamento.entity';
import { OrderAddress } from 'src/order/entities/orderAddress.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('numeric', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  priceShipping: number;

  @ManyToOne(() => Departamento, (departamento) => departamento.municipios)
  departamento: Departamento;

  @OneToMany(() => OrderAddress, (orderAddress) => orderAddress.municipio)
  orderAddresses: OrderAddress[];

}
