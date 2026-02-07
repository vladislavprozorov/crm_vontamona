import { RequestEntity } from "src/requests/entity/request.entity";
import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "clients"})
export class ClientEntity {
    @PrimaryColumn()
    @Generated("uuid")
    id: string;


    @Column({type: "varchar", length: 128, nullable: false, name: "full_name"})
    fullName: string;

    @Column()
    email: string;

    @OneToMany(() => RequestEntity, request => request.client)
    requests: RequestEntity[]
    
    @Column({type: "text"})
    description: string;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt: Date;
} 