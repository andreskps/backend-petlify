import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Badge } from "./badge.entity";


@Entity()
export class UserBadge {

    @PrimaryGeneratedColumn()
    id: number;

    

    @ManyToOne(() => User, user => user.userBadge)
    user: User;

    @ManyToOne(() => Badge, user => user.userBadge)
    badge: Badge;


}

   