import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

export enum UserTenantRole {
    OWNER = "owner",
    ATTENDANT = "attendant"
}

@Entity('tenant_user')
export class TenantUser extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
    })
    tenant_id: string;

    @ManyToOne(() => Tenant, tenant => tenant.users)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({
        nullable: false,
    })
    external_user_id: string;

    @Column({ nullable: false, enum: UserTenantRole })
    role: UserTenantRole;
}