import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";



@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn('uuid')
    id:string;


    @Column({type: 'varchar', length:255})
    name:string;

    @Column({type: 'text', nullable: true})
    description:string;

    @Column({type: 'varchar', length: 255})
    address:string;

    @Column({type:'varchar', length:255, nullable: true})
    image:string;

    @Column({type: 'boolean', default: true})
    isOpen:boolean;


    @Column({type: 'uuid'})
    ownerId:string;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'ownerId'})
    owner: User;

    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;

}