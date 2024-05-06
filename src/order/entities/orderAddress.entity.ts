import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  address: string;

  @Column('text', {
    nullable: true,
  })
  neighborhood: string;

  @Column('text', {
    nullable: true,
  })
  addressDetail: string;

  @ManyToOne(() => Municipio, (municipio) => municipio.orderAddresses)
  municipio: Municipio;
}
