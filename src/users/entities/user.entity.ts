import { ValidRoles } from "src/auth/enums/Validate-Roles.enum";
import { UserBadge } from "src/badge/entities/user-badge.entity";
import { Order } from "src/order/entities/order.entity";
import { Review } from "src/review/entities/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    name:string;

    @Column({
        type:'text',
        unique:true
    })
    email:string;

    @Column('text',{
        select:false
    })
    password:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @Column('text',{
        nullable:true
    })
    token:string;

    @Column('enum',{
        enum:ValidRoles,
        array:true,
        default:[ValidRoles.user]
    })
    roles:ValidRoles[];

    @OneToMany(()=>Order,order=>order.user)
    orders:Order[];

    @OneToMany(()=>UserBadge,userBadge=>userBadge.user)
    userBadge:UserBadge[];

    @OneToMany(()=>Review,review=>review.user)
    reviews:Review[];

}
