import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenant')
export class Tenant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
    })
    name: string;


    @Column({
        nullable: false,
    })
    segment: string;

    @Column({
        nullable: false,
        unique: true,
    })
    CNPJ: string;

    @Column({
        nullable: false,
        default: true,
    })
    active: boolean;
}