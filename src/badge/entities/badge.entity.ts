import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBadge } from './user-badge.entity';

@Entity()
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @Column('boolean')
  isActive: boolean;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.badge)
  userBadge: UserBadge[];
}
