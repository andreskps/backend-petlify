import { ValidRoles } from "src/auth/enums/Validate-Roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('enum',{
        enum:ValidRoles,
        array:true,
        default:[ValidRoles.user]
    })
    roles:ValidRoles[];
}
