import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Reward } from 'src/modules/rewards/entities/reward.entity';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';

export enum TransactionEnum {
    OUTPUT = "output",
    INPUT = "input"
}

@Entity('transaction')
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TransactionEnum,
        nullable: false,
    })
    type: TransactionEnum;

    @Column({ nullable: false })
    points: number;

    @Column({ nullable: true, type: "decimal" })
    value?: number;

    @Column({
        nullable: false,
    })
    tenant_id: string;

    @ManyToOne(() => Tenant, tenant => tenant.transactions, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ nullable: true })
    customerId: string;

    @ManyToOne(() => Customer, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column({ nullable: true })
    rewardId?: string;

    @ManyToOne(() => Reward, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'rewardId' })
    reward: Reward;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: "date", nullable: true })
    expiredAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
