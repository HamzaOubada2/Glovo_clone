import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../../enum/UserRole";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

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