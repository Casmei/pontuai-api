import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Reward } from 'src/modules/rewards/entities/reward.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TenantConfig } from './tenant-config.entity';
import { TenantUser } from './tenant-user.entity';

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

  @OneToMany(
    () => TenantUser,
    (tenantUser) => tenantUser.tenant,
    {
      cascade: true,
    },
  )
  users: TenantUser[];

  @OneToMany(
    () => Customer,
    (customer) => customer.tenant,
    {
      cascade: true,
    },
  )
  customers: Customer[];

  @OneToMany(
    () => Customer,
    (customer) => customer.tenant,
    {
      cascade: true,
    },
  )
  transactions: Transaction[];

  @OneToMany(
    () => Reward,
    (reward) => reward.tenant,
    {
      cascade: true,
    },
  )
  rewards: Reward[];

  @OneToOne(
    () => TenantConfig,
    (tenantConfig) => tenantConfig.tenant,
    {
      cascade: true,
    },
  )
  config: TenantConfig;
}
