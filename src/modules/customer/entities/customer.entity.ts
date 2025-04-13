import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  tenant_id: string;

  @ManyToOne(() => Tenant, tenant => tenant.customers, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Transaction, tenant => tenant.customer, {
    onDelete: 'SET NULL'
  })
  transactions: Transaction[];

  @Column({
    nullable: false,
  })
  name: string;

  @Column({ nullable: true, unique: true })
  phone: string;
}