import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;


  @OneToMany(() => Municipio, (municipio) => municipio.departamento)
    municipios: Municipio[];
  
    
}
