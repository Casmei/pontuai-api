import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TenantUser } from './tenant-user.entity';
import { TenantConfig } from './tenant-config';

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
        unique: true,
    })
    CNPJ: string;

    @Column({
        nullable: false,
        unique: true,
    })
    slug: string;

    @Column({
        nullable: false,
        default: true,
    })
    active: boolean;

    @OneToMany(() => TenantUser, tenantUser => tenantUser.tenant, {
        cascade: true
    })
    users: TenantUser[];

    @OneToOne(() => TenantConfig, tenantConfig => tenantConfig.tenant, {
        cascade: true
    })
    config: TenantConfig;
}