import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  lastName: string;

  @Column('text')
  address: string;

  @Column('text')
  neighborhood: string;
  
  @Column('text')
  addressDetail: string;

  @Column('text')
  phone: string;

  @ManyToOne(() => Municipio, (municipio) => municipio.orderAddresses)
  municipio: Municipio;
}
