import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../../enum/UserRole.js";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:number;

    @Column({unique: true})
    email:string;


    @Column()
    password:string;

    @Column()
    phone: string;


    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;


    @CreateDateColumn()
    created_at: Date;
}