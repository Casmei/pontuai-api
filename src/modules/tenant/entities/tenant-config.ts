import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

export interface PointConfig {
    pointsForMoneySpent: number,
    expirationInDays: number,
    minimumValueForWinPoints: number,
}

export interface WhatsappConfig {
    baseUrl: string,
    apikey: string,
    instanceName: string
}

@Entity('tenant_config')
export class TenantConfig extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
    })
    tenant_id: string;

    @OneToOne(() => Tenant, tenant => tenant.config, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({
        nullable: false,
        type: 'jsonb'
    })
    point_config: PointConfig;

    @Column({
        nullable: true,
        type: 'jsonb'
    })
    whatsapp_config?: WhatsappConfig;
}