import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserTenant } from './user-tenant.entity';

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

    @OneToMany(() => UserTenant, userTenant => userTenant.tenant)
    user_tenants: UserTenant[];
}