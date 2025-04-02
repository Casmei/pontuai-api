import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

export interface PointConfig {
    ratio: {
        amount: number,
        moneySpent: number,
    },
    expirationInDays: number,
    minimumRedemptionValue: number
}

@Entity('tenant_config')
export class TenantConfig extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
    })
    tenant_id: string;

    @OneToOne(() => Tenant, tenant => tenant.config)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({
        nullable: false,
        type: 'jsonb'
    })
    point_config: PointConfig;
}