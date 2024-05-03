import { Departamento } from 'src/departamentos/entities/departamento.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
