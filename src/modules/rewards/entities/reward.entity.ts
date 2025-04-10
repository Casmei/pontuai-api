import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reward')
export class Reward extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
    })
    tenant_id: string;

    @ManyToOne(() => Tenant, tenant => tenant.rewards, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false })
    point_value: number;
}